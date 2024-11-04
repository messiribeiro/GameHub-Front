/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import Verified from 'react-native-vector-icons/MaterialIcons';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ListRenderItem,
  ActivityIndicator,
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
  Subscription: {
    type: string,
    isActive: boolean,
  }
}

interface InterestUser {
  id: number;
  username: string;
  profilePictureUrl: string;
  GameUser: GameUser[];
  Subscription: {
    type: string,
    isActive: boolean,
  }
}

type Props = StackScreenProps<RootStackParamList, 'FindGamer'>;

const FindGamer = ({ navigation, route }: Props) => {
  const { gameId } = route.params;
  const [interestUsers, setInterestUsers] = useState<InterestUser[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noUsersMessage, setNoUsersMessage] = useState<string | null>(null); // Estado para mensagem

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      console.log('userId após a atualização:', id);
    };
    getUserId();
  }, []);

  // Função para buscar usuários interessados em um jogo
  const fetchInterestUsers = async (gameId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`api/user-game-interests/game/${gameId}`);
      const users = response.data.interestedUsers;
      console.log(users);

      console.log('userId usado no filtro:', Number(userId));
      const filteredUsers = users.filter((user: InterestUser) => user.id !== Number(userId));
      console.log(filteredUsers);

      setInterestUsers(filteredUsers);

      // Verifica se não há usuários filtrados
      if (filteredUsers.length === 0) {
        setNoUsersMessage('Nenhum usuário encontrado que joga este jogo.'); // Mensagem de ausência
      } else {
        setNoUsersMessage(null); // Reseta a mensagem se houver usuários
      }
    } catch (error) {
      console.error('Erro ao buscar dados de interesse:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameId && userId) {
      fetchInterestUsers(gameId);
    }
  }, [gameId, userId]);

  const defaultImageUrl =
    'https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg';

    const renderUser: ListRenderItem<User> = ({ item }) => {
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
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{item.username}</Text>
            {item.Subscription?.isActive && (  // Verificando se a assinatura é ativa
              <Verified name="verified" size={16} color="#FFC000" style={styles.verifiedIcon} />
            )}
          </View>
          <View style={styles.bio}>
            <Text style={styles.gamesText}>Jogos</Text>
            <View style={styles.games}>
              {item.GameUser.map((gameUser) => (
                <Image 
                  key={gameUser.gameId} // Ensure gameId is unique
                  source={{ uri: gameUser.game.gameimageUrl }} 
                  style={styles.gameImage} 
                />
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
      {loading ? ( // Verifica se está carregando
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#5312C2" />
        </View>
      ) : noUsersMessage ? ( // Verifica se há mensagem de ausência de usuários
        <View style={styles.centeredContainer}>
          <Text style={styles.noUsersText}>{noUsersMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={interestUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
          initialScrollIndex={interestUsers.length > 0 ? currentUserIndex : 0}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: '10%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
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
  noUsersText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 10,
  },
  verifiedIcon: {
    top: 2,
  },
});

export default FindGamer;
