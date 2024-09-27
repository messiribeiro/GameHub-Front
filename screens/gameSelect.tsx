/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import Icon from "react-native-vector-icons/Feather";

import { RootStackParamList } from '../navigation';
import api from '../services/api';

// Definindo o tipo das props
type Props = StackScreenProps<RootStackParamList, 'GameSelect'>;

const GameSelect = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const games = [
    {
      id: '1',
      name: 'Apex Legends',
      icon: { uri: 'https://www.malwarebytes.com/wp-content/uploads/sites/2/2024/03/Apex_legends_logo.png?w=1200' },
    },
    {
      id: '2',
      name: 'World of Warcraft',
      icon: { uri: 'https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2024/04/wovr.jpg' },
    },
    {
      id: '3',
      name: 'Age of Empires',
      icon: { uri: 'https://www.ageofempires.com/wp-content/uploads/2021/10/ogthumb.jpg' },
    },
    {
      id: '4',
      name: 'League of Legends',
      icon: { uri: 'https://static.wikia.nocookie.net/leagueoflegends/images/7/76/LoL_Icon.png/revision/latest?cb=20170427054945' },
    },
    // Add more games here
  ];

  // Carregar o ID do usuário do AsyncStorage
  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    loadUserId();
  }, []);

  // Filtra os jogos com base na busca
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Alterna a seleção de jogos
  const toggleSelectGame = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      setSelectedGames(selectedGames.filter(id => id !== gameId));
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
  };



    const handleSave = async () => {
      try {
        const userResponse = await api.post('/api/auth/signup', {
          username: 'testUser',
          email: 'test@example.com',
          password: 'password123',
          profilePicture: null,
          game: [1, 2], // Example game IDs
        });

        console.log('API Response:', userResponse);

        if (userResponse.status === 201) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Erro', 'Não foi possível criar o usuário.');
        }
      } catch (error) {
        console.error('API Error:', error);
        Alert.alert('Erro', 'Erro ao processar sua solicitação.');
      }
    };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quais jogos você joga?</Text>

      <View style={styles.gamesSection}>
        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Pesquisar"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Lista de Jogos */}
        <FlatList
          data={filteredGames}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.gameIconContainer,
                selectedGames.includes(item.id) && styles.selectedGameIconContainer
              ]}
              onPress={() => toggleSelectGame(item.id)}
            >
              <Image source={item.icon} style={styles.gameIcon} />
            </TouchableOpacity>
          )}
          style={styles.gameList}
        />
      </View>

      {/* Botão para salvar jogos selecionados */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Avançar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  searchBar: {
    width: '100%',
    height: 20,
    paddingHorizontal: 15,
    color: '#fff',
    flex: 1,
    fontSize: 16,
  },
  gamesSection: {
    width: "70%",
    height: 300,
    backgroundColor: "#363636",
    display: "flex",
    alignItems: "center",
    borderRadius: 5,
  },
  gameList: {
    flexGrow: 0,
    marginBottom: 20,
  },
  gameIconContainer: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedGameIconContainer: {
    borderWidth: 2,
    borderColor: '#512DA8',
    borderRadius: 5,
  },
  gameIcon: {
    width: 75,
    height: 75,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#512DA8',
    padding: 15,
    borderRadius: 10,
    width: '70%',
    height: 50,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 5,
    paddingLeft: 15,
    paddingTop: 15,
    marginBottom: 10
  },
  icon: {
    marginRight: 0,
  },
});

export default GameSelect;
