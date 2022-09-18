import { Image, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '../../assets/logo-nlw-esports.png';
import { Heading } from '../../components/Heading';
import { Background } from '../../components/Background';
import { GameCard, GameCardProps } from '../../components/GameCard';

import { GameParams } from '../../@types/navigation';
import { CURRENT_IP } from '../../utils';
import { styles } from './styles';

interface Game {
    id: string;
    title: string;
    bannerUrl: string;
    _count: {
        ads: number;
    }
}

export function Home() {
    const [games, setGames] = useState<GameCardProps[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetch(`http://${CURRENT_IP}:3333/games`)
            .then(response => response.json())
            .then((data: Game[]) => {
                const gamesList = data.map(game => ({
                    id: game.id,
                    title: game.title,
                    bannerUrl: game.bannerUrl,
                    adsCount: `${game._count.ads} anúncio(s)`
                }))
                setGames(gamesList)
            })
    }, []);

    function handleOpenGame(gameParams: GameParams) {
        navigation.navigate('game', gameParams)
    };

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Image source={Logo} style={styles.logo} />
                <Heading
                    title='Encontre seu duo!'
                    subtitle='Selecione o game que deseja jogar...'
                />
                <FlatList
                    data={games}
                    keyExtractor={game => game.id}
                    renderItem={({ item }) => (
                        <GameCard data={item} onPress={() => handleOpenGame(item)} />
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerList}
                    horizontal
                />
            </SafeAreaView>
        </Background>
    );
}