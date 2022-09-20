import { useEffect, useState } from "react";
import { Check, GameController } from "phosphor-react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

import { Input } from "./Input";
import { Label } from "./Label";
import { GameBannerProps } from "../GameBanner";
import { Game } from "../../App";

import { notify } from "../../utils";

export function Form() {
    const [games, setGames] = useState<GameBannerProps[]>([]);
    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [useVoiceChannel, setUseVoiceChannel] = useState(false);

    useEffect(() => {
        axios('http://localhost:3333/games')
            .then(({ data }) => {
                const games = data.map((game: Game) => ({
                    id: game.id,
                    title: game.title,
                    bannerUrl: game.bannerUrl,
                    adsCount: game._count.ads
                }))
                setGames(games)
            })
    }, []);

    function handleCreateAd(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        if (!data.name) return;

        try {
            axios.post(`http://localhost:3333/games/${data.game}/ads`, {
                name: data.name,
                yearsPlaying: Number(data.yearsPlaying),
                discord: data.discord,
                weekDays: weekDays.map(Number),
                hoursStart: data.hoursStart,
                hoursEnd: data.hoursEnd,
                useVoiceChannel
            });
            notify('Anúncio criado com sucesso!');
        } catch (error) {
            console.log(error);
            notify('Erro ao criar anúncio!', true);
        }
    }

    return (
        <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="game" className='font-semibold'>Qual o game?</Label>
                <select
                    id='game'
                    name='game'
                    className='bg-zinc-900 py-3 px-4 rounded-lg text-sm text-white placeholder:text-zinc-500 appearance-none'
                    defaultValue="0"
                >
                    <option disabled value="0">Selecione o game que deseja jogar</option>
                    {games.length > 0 && games.map((game) => (
                        <option key={game.id} value={game.id}>{game.title}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="name" className='font-semibold'>Seu nome (ou nickname)</Label>
                <Input id="name" name="name" type="text" placeholder='Como te chamam dentro do game?' />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="yearsPlaying" className='font-semibold'>Joga há quantos anos?</Label>
                    <Input id="yearsPlaying" name="yearsPlaying" type="number" placeholder='Tudo bem ser ZERO' />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="discord">Qual seu Discord?</Label>
                    <Input id="discord" name="discord" type="text" placeholder='Usuario#0000' />
                </div>
            </div>

            <div className="flex gap-6">
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="weekDays">Quando costuma jogar?</Label>
                    <div className="">
                        <ToggleGroup.Root
                            type="multiple"
                            className="grid grid-cols-4 gap-2"
                            value={weekDays}
                            onValueChange={setWeekDays}
                        >
                            <ToggleGroup.Item
                                value="0"
                                className={`"w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                title="Domingo">D
                            </ToggleGroup.Item>
                            <ToggleGroup.Item
                                value="1"
                                className={`"w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                title="Segunda">S
                            </ToggleGroup.Item>
                            <ToggleGroup.Item

                                value="2"
                                className={`"w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                title="Terça">T
                            </ToggleGroup.Item>
                            <ToggleGroup.Item

                                value="3"
                                className={`"w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                title="Quarta">Q
                            </ToggleGroup.Item>
                            <ToggleGroup.Item

                                value="4"
                                className={`"w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                title="Quinta">Q
                            </ToggleGroup.Item>
                            <ToggleGroup.Item

                                value="5"
                                className={`"w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                title="Sexta">S
                            </ToggleGroup.Item>
                            <ToggleGroup.Item

                                value="6"
                                className={`"w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                title="Sábado">S
                            </ToggleGroup.Item>
                        </ToggleGroup.Root>
                    </div>
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                    <Label htmlFor="hoursStart">Qual horário do dia?</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input id="hoursStart" name="hoursStart" type="time" placeholder='De' />
                        <Input id="hoursEnd" name="hoursEnd" type="time" placeholder='Até' />
                    </div>
                </div>
            </div>

            <label className="mt-2 flex items-center gap-2 text-sm">
                <Checkbox.Root
                    checked={useVoiceChannel}
                    onCheckedChange={(checked) => setUseVoiceChannel(checked === true)}
                    className="w-6 h-6 p-1 rounded bg-zinc-900"
                >
                    <Checkbox.Indicator className='w-4 h-4 rounded bg-zinc-900'>
                        <Check className="w-4 h-4 text-emerald-400" />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                Costumo me conectar ao chat de voz
            </label>

            <footer className="mt-4 flex justify-end gap-4">
                <Dialog.Close
                    className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
                    type="button"
                >
                    Cancelar
                </Dialog.Close>
                <button
                    className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
                    type="submit"
                >
                    <GameController size={24} />
                    Encontrar duo
                </button>
            </footer>
        </form>
    )
}