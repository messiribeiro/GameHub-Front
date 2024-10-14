import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import Header from 'components/Header';
import PostFeed from 'components/PostFeed';
import TabMenu from 'components/TabMenu';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

interface Game {
  id: number;
  name: string;
  gameimageUrl: string;
}

interface Post {
  id: number;
  content: string;
  imageUrl: string;
  authorId: number;
  createdAt: string;
}

const Home = ({ navigation }: Props) => {
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]); // Defina o tipo para posts
  const [postLimit, setPostLimit] = useState(5); // Limite inicial
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const fetchPosts = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/api/post');
      const sortedPosts = response.data.reverse().slice(0, postLimit); // Inverte a ordem antes de aplicar o limite
      setPosts(sortedPosts);
      setHasMorePosts(response.data.length > postLimit); // Verifica se há mais posts
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    fetchPosts();
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

  const loadMorePosts = async () => {
    if (hasMorePosts) {
      const response = await api.get('/api/post');
      const newPosts = response.data.reverse().slice(posts.length, posts.length + postLimit); // Inverte a ordem
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMorePosts(newPosts.length > 0);
    }
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
      <FlatList
        style={styles.container}
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={() => (
          <>
            <Header navigation={navigation} />
            <View style={styles.searchContainer}>
              <Text style={styles.searchTitle}>O que você quer jogar hoje?</Text>
              <Icon name="search" size={24} color="#fff" />
            </View>
            <View style={styles.games}>
              {combinedGames.length > 0 ? (
                <FlatList
                  horizontal
                  data={combinedGames}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleImagePress(item.id)}
                      style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.gameimageUrl }}
                        style={styles.image}
                        onError={() => console.error('Erro ao carregar imagem do jogo')}
                      />
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.noGamesText}>Nenhum jogo disponível no momento</Text>
              )}
            </View>
          </>
        )}
        renderItem={({ item }) => <PostFeed post={item} />}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.1}
      />
      <TabMenu navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: '10%',
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
    marginBottom: 30,
    marginTop: 10,
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
