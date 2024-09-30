import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import api from 'services/api';

import { RootStackParamList } from '../navigation';

const { height } = Dimensions.get('window');

// Tipos de dados
interface Game {
  id: number;
  name: string;
  gameimageUrl: string;
  description: string | null;
}

interface GameUser {
  gameId: number;
  userId: number;
  game: Game;
}

interface User {
  id: number;
  username: string;
  profilePictureUrl: string;
  GameUser: GameUser[];
}

interface InterestUser {
  userId: number;
  userName: string;
}

type Props = StackScreenProps<RootStackParamList, 'FindGamer'>;

const FindGamer = ({ navigation }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [interestUsers, setInterestUsers] = useState<InterestUser[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      console.log('userId após a atualização:', id);
    };
    getUserId();
  }, []);

  // Função para buscar dados da API
  const fetchUsers = async () => {
    if (!userId) {
      console.error('userId é null ou undefined');
      return;
    }

    try {
      const response = await api.get(`api/user-game-interests/similar-games/${userId}`);
      const data = response.data;

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('A resposta da API não é uma array:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Função para buscar usuários interessados em um jogo
  const fetchInterestUsers = async (gameId: number) => {
    try {
      const response = await api.get(`api/user-game-interests/game/${gameId}`);
      const data: InterestUser[] = response.data;

      if (Array.isArray(data)) {
        setInterestUsers(data);
      } else {
        console.error('A resposta da API não é uma array:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados de interesse:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  useEffect(() => {
    if (currentGameId) {
      fetchInterestUsers(currentGameId);
    }
  }, [currentGameId]);

  // URL da imagem padrão
  const defaultImageUrl =
    'https://media.istockphoto.com/id/1185655985/vector/gamer-portrait-video-games-background-glitch-style-player-vector-illustration-online-user.jpg?s=612x612&w=0&k=20&c=uoy0NDqomF2RzJdrNFQM25WwVahjRggjDHYhQoNnx3M=';

  const renderUser: ListRenderItem<User> = ({ item }) => {
    // Verifica a URL da imagem e substitui, se necessário
    const profileImageUrl =
      item.profilePictureUrl === 'https://example.com/profile-picture.jpg'
        ? defaultImageUrl
        : item.profilePictureUrl;

    return (
      <View style={styles.gamerData}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile', { profileUserId: String(item.id) })}>
          <Image source={{ uri: profileImageUrl }} style={styles.userImage} />
        </TouchableOpacity>
        <Text style={styles.username}>{item.username}</Text>
        <View style={styles.bio}>
          <Text style={styles.gamesText}>Jogos</Text>
          <View style={styles.games}>
            {item.GameUser.map((gameUser) => (
              <TouchableOpacity
                key={gameUser.gameId}
                onPress={() => {
                  setCurrentGameId(gameUser.gameId); // Atualiza o gameId atual
                }}>
                <Image source={{ uri: gameUser.game.gameimageUrl }} style={styles.gameImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.invite}
          onPress={() => {
            navigation.navigate('ChatWindow', { receiverId: item.id, receiverName: item.username });
          }}>
          <Text style={styles.inviteText}>Convidar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        initialScrollIndex={currentUserIndex}
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.y / height);
          setCurrentUserIndex(index);
        }}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: '10%',
  },
  gamerData: {
    width: '100%',
    height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -50,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  username: {
    color: 'white',
    marginTop: 10,
    fontSize: 20,
    fontWeight: '700',
  },
  bio: {
    backgroundColor: '#2B2B2C',
    width: '80%',
    height: 150,
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
  },
  gamesText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  invite: {
    width: 130,
    height: 40,
    backgroundColor: '#5312C2',
    borderRadius: 10,
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteText: {
    color: 'white',
  },
  games: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
  gameImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
});

export default FindGamer;
