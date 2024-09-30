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
  ActivityIndicator, // Importando o indicador de carregamento
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api';

import { RootStackParamList } from '../navigation';

// Definindo o tipo das props
type Props = StackScreenProps<RootStackParamList, 'Home'>;

interface Game {
  id: number;
  name: string;
  gameimageUrl: string;
}

interface User {
  id: number;
  username: string;
  GameUser: {
    game: Game;
  }[];
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
    console.log(userId);
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
        setLoading(false); // Define como carregado após os dados serem obtidos
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

  // Combinando jogos do usuário com os outros jogos
  const combinedGames = [
    ...userGames,
    ...allGames.filter((game) => !userGames.some((userGame) => userGame.id === game.id)),
  ];

  // Renderiza um indicador de carregamento se os dados estiverem sendo carregados
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {combinedGames.map((game, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(game.id)}
                style={styles.imageContainer}>
                <Image source={{ uri: game.gameimageUrl }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.postContainer}>
          <View style={styles.post}>
            <View style={styles.user}>
              <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
                <Image
                  style={styles.userImage}
                  source={{
                    uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.userName}>User1</Text>
            </View>
            <Text style={styles.postTitle}>Namoral não acredito que fiz isso</Text>
            <Image
              style={styles.postContent}
              source={{
                uri: 'https://cdn.mos.cms.futurecdn.net/csQgknvLgV4P4ABbFSZdrE.jpg',
              }}
            />
            <View style={styles.dataView}>
              <View style={styles.postData}>
                <View style={styles.commentsAndLikes}>
                  <Icon name="message-circle" size={24} color="#fff" />
                  <Text style={styles.comments}>10</Text>
                </View>

                <View style={styles.commentsAndLikes}>
                  <Icon name="heart" size={18} color="#fff" />
                  <Text style={styles.likes}>20</Text>
                </View>
              </View>

              <View>
                <Text style={styles.time}>Há 5h</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <TabMenu navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  searchContainer: {
    display: 'flex',
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
  post: {
    marginTop: 35,
  },
  postContainer: {},
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  postContent: {
    width: '100%',
    height: 250,
    backgroundColor: 'white',
    marginTop: 5,
  },
  postData: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  dataView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  postTitle: {
    color: 'white',
    marginTop: 10,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  userName: {
    color: 'white',
  },
  comments: {
    color: 'white',
  },
  likes: {
    color: 'white',
  },
  commentsAndLikes: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  time: {
    color: 'white',
  },
});

export default Home;
