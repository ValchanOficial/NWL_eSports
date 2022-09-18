import { FlatList, Image, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { GameParams } from '../../@types/navigation';

import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { Background } from '../../components/Background';
import { DuoMatch } from '../../components/DuoMatch';

import Logo from '../../assets/logo-nlw-esports.png';
import { THEME } from '../../theme';
import { CURRENT_IP } from '../../utils';
import { styles } from './styles';

export function Game() {
    const [duos, setDuos] = useState<DuoCardProps[]>([]);
    const [discordDuoSelected, setDiscordDuoSelected] = useState('');

    const route = useRoute();
    const game = route.params as GameParams;

    const navigation = useNavigation();
    function handleGoBack() {
        navigation.goBack()
    }

    console.log(discordDuoSelected)

    async function getDiscordUser(adsId: string) {
        fetch(`http://${CURRENT_IP}:3333/ads/${adsId}/discord`)
            .then(response => response.json())
            .then(data => setDiscordDuoSelected(data.discord))
    };

    useEffect(() => {
        fetch(`http://${CURRENT_IP}:3333/games/${game.id}/ads`)
            .then(response => response.json())
            .then(data => setDuos(data))
    }, []);

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Entypo name='chevron-thin-left' color={THEME.COLORS.CAPTION_300} size={20} />
                    </TouchableOpacity>
                    <Image source={Logo} style={styles.logo} />
                    <View style={styles.right} />
                </View>

                <Image source={{ uri: game.bannerUrl }} style={styles.cover} resizeMode="cover" />
                <Heading title={game.title} subtitle='Conecte-se e começe a jogar!' />
                <FlatList
                    data={duos}
                    horizontal
                    style={styles.containerList}
                    contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
                    showsHorizontalScrollIndicator
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
                    )}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyListText}>
                            Não há anúncios publicados ainda!
                        </Text>
                    )}
                />

                <DuoMatch
                    visible={discordDuoSelected.length > 0}
                    discord={discordDuoSelected}
                    onClose={() => setDiscordDuoSelected('')}
                />

            </SafeAreaView>
        </Background>
    );
}