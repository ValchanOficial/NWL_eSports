import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { PrismaClient } from "@prisma/client";
import * as dotenv from 'dotenv';
dotenv.config()

import { convertHourStringToMinutes, convertMinutesToHourString } from './utils';

const prisma = new PrismaClient({
    log: ['query'],
});
const app = express();
app.use(express.json());
app.use(cors());
app.use((_, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET, POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/games', async (_: Request, res: Response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                },
            },
        },
    });
    return res.status(200).json(games);
});

app.post('/games/:id/ads', async (req: Request, res: Response) => {
    const gameId = String(req.params.id);
    const data = req.body;
    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: data.name,
            yearsPlaying: data.yearsPlaying,
            discord: data.discord,
            weekDays: data.weekDays,
            hoursStart: convertHourStringToMinutes(data.hoursStart),
            hoursEnd: convertHourStringToMinutes(data.hoursEnd),
            useVoiceChannel: data.useVoiceChannel,
        }
    })
    return res.status(201).json(ad);
});

app.get('/games/:id/ads', async (req: Request, res: Response) => {
    const gameId = String(req.params.id);
    const ads = await prisma.ad.findMany({
        where: {
            gameId,
        },
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hoursStart: true,
            hoursEnd: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    const formattedAds = ads.map((ad) => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hoursStart: convertMinutesToHourString(ad.hoursStart),
            hoursEnd: convertMinutesToHourString(ad.hoursEnd),
        }
    });
    return res.status(200).json(formattedAds);
});

app.get('/ads/:id/discord', async (req: Request, res: Response) => {
    const adId = String(req.params.id);
    const discord = await prisma.ad.findUniqueOrThrow({
        where: {
            id: adId,
        },
        select: {
            discord: true,
        },
    });
    return res.status(200).json({ discord });
});

// Extra routes

app.post('/twitch/token', async (_: Request, res: Response) => {
    try {
        const { data } = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: 'client_credentials',
        });
        app.set('auth', data.access_token);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error while trying to get Twitch token',
        });
    }
});

app.get('/twitch/top-games', async (_: Request, res: Response) => {
    try {
        const { data } = await axios.get('https://api.twitch.tv/helix/games/top', {
            headers: {
                'Authorization': `Bearer ${app.get('auth')}`,
                'Client-ID': String(process.env.TWITCH_CLIENT_ID),
            },
        });
        return res.status(200).json(data?.data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error while fetching Twitch API',
        });
    }
});

app.listen(3333, () => console.log('Server is running on port 3333'));
