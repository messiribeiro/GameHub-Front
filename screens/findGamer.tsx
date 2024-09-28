/* eslint-disable prettier/prettier */
import { StackScreenProps } from '@react-navigation/stack';
import Header from 'components/Header';
import TabMenu from 'components/TabMenu';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ListRenderItem
} from 'react-native';
import api from 'services/api'; // Importa a instância configurada do axios

import { RootStackParamList } from '../navigation';

const { height } = Dimensions.get('window');

// Tipos de dados
interface Game {
  id: number;
  name: string;
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
type Props = StackScreenProps<RootStackParamList, 'FindGamer'>;

const FindGamer = ({ navigation }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  // Função para buscar dados da API
  const fetchUsers = async () => {
    try {
      const response = await api.get('https://gamehub-back-6h0k.onrender.com/api/user-game-interests/36/find-similar-games');
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUser: ListRenderItem<User> = ({ item }) => (
    <View style={styles.gamerData}>
      <Image source={{ uri: item.profilePictureUrl }} style={styles.userImage} />
      <Text style={styles.username}>{item.username}</Text>
      <View style={styles.bio}>
        <Text style={styles.gamesText}>Jogos</Text>
        <View style={styles.games}>
          {item.GameUser.map((gameUser, index) => (
            <Text key={index} style={styles.gameText}>{gameUser.game.name}</Text>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.invite} onPress={() => {
        navigation.navigate("Profile", { profileUserId: item.id.toString() })
      }} >
        <Text style={styles.inviteText}>Convidar</Text>
      </TouchableOpacity>
    </View>
  );

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
    height, // Altura igual à altura da tela
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
  gameText: {
    color: 'white',
    marginTop: 10,
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
  games: {}
});

export default FindGamer;