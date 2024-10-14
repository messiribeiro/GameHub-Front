import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import Header from 'components/Header';
import PostFeed from 'components/PostFeed';
import TabMenu from 'components/TabMenu';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [postLimit, setPostLimit] = useState(5);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const inputRef = useRef<TextInput | null>(null);

  const fetchPosts = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/api/post');
      const sortedPosts = response.data.reverse().slice(0, postLimit);
      setPosts(sortedPosts);
      setHasMorePosts(response.data.length > postLimit);
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
      const newPosts = response.data.reverse().slice(posts.length, posts.length + postLimit);
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMorePosts(newPosts.length > 0);
    }
  };

  const combinedGames = [
    ...userGames,
    ...allGames.filter((game) => !userGames.some((userGame) => userGame.id === game.id)),
  ];

  const filteredGames = combinedGames.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchIconPress = () => {
    setIsSearchActive(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.searchContainer}>
        {isSearchActive ? (
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text === '') {
                setIsSearchActive(false); // Desativa a busca se o texto estiver vazio
              }
            }}
            placeholder="Digite o nome do jogo"
            placeholderTextColor="#aaa"
            onBlur={() => {
              if (searchQuery === '') {
                setIsSearchActive(false); // Desativa a busca se o input perder o foco e estiver vazio
              }
            }}
            onFocus={() => setIsSearchActive(true)}
            onSubmitEditing={() => {
              console.log('Busca:', searchQuery);
            }}
          />
        ) : (
          <TouchableOpacity style={styles.searchBar} onPress={handleSearchIconPress}>
            <Text style={styles.searchTitle}>O que você quer jogar hoje?</Text>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.games}>
        {filteredGames.length > 0 ? (
          <FlatList
            horizontal
            data={filteredGames}
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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => <PostFeed post={item} />}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.1}
        keyboardShouldPersistTaps="handled" // Mantém o teclado aberto ao interagir
      />
      <TabMenu navigation={navigation} />
    </View>
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
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  searchTitle: {
    color: 'white',
    fontSize: 17,
  },
  games: {
    paddingLeft: '3%',
    paddingRight: '3%',
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
  searchInput: {
    color: 'white',
    fontSize: 17,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Home;
