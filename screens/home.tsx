import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import Header from 'components/Header';
import TabMenu from 'components/TabMenu';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api';
import PostFeed from 'components/PostFeed'; // Componente separado para o feed de posts

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

interface Game {
  id: number;
  name: string;
  gameimageUrl: string;
}

const Home = ({ navigation }: Props) => {
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    loadUserId();
  }, []);

  const fetchUserGames = async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/api/users/${userId}`);
      setUserGames(response.data.GameUser.map((gameUser: any) => gameUser.game));
    } catch (error) {
      console.error('Erro ao buscar jogos do usuário:', error);
    }
  };

  const fetchAllGames = async () => {
    try {
      const response = await api.get('/api/games');
      setAllGames(response.data);
    } catch (error) {
      console.error('Erro ao buscar todos os jogos:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await fetchUserGames();
        await fetchAllGames();
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) {
      await fetchUserGames();
      await fetchAllGames();
    }
    setRefreshing(false);
  };

  const handleImagePress = (gameId: number) => {
    navigation.navigate('FindGamer', { gameId });
  };

  const combinedGames = [
    ...userGames,
    ...allGames.filter((game) => !userGames.some((userGame) => userGame.id === game.id)),
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Header navigation={navigation} />
        <View style={styles.searchContainer}>
          <Text style={styles.searchTitle}>O que você quer jogar hoje?</Text>
          <Icon name="search" size={24} color="#fff" />
        </View>
        <View style={styles.games}>
          {combinedGames.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
              {combinedGames.map((game, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(game.id)}
                  style={styles.imageContainer}>
                  <Image
                    source={{ uri: game.gameimageUrl }}
                    style={styles.image}
                    onError={() => console.error('Erro ao carregar imagem do jogo')}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noGamesText}>Nenhum jogo disponível no momento</Text>
          )}
        </View>
        <PostFeed />
      </ScrollView>
      <TabMenu navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    width: '100%',
    height: '100%',
    paddingTop: '10%',
    color: 'white',
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  searchTitle: {
    color: 'white',
    fontSize: 17,
  },
  games: {
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  scrollView: {
    paddingTop: 15,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  noGamesText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Home;
