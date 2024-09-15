/* eslint-disable prettier/prettier */
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

import { RootStackParamList } from '../navigation';

// Defining the type of props
type Props = StackScreenProps<RootStackParamList, 'GameSelect'>;

const GameSelect = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  const games = [
    { id: '1', name: 'Fortnite', icon: require('../assets/gameIcons/fortnite.png') },
    { id: '2', name: 'GTAV', icon: require('../assets/gameIcons/gtaV.png') },
    { id: '3', name: 'Counter-Strike 2', icon: require('../assets/gameIcons/cs2.png') },
    { id: '4', name: 'Valorant', icon: require('../assets/gameIcons/valorant.png') },
    { id: '5', name: 'Minecraft', icon: require('../assets/gameIcons/minecraft.png') },
    { id: '6', name: 'League of Legends', icon: require('../assets/gameIcons/lol.png') },
    // Add more games here
  ];

  // Filter the games based on search query
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle selection of games
  const toggleSelectGame = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      setSelectedGames(selectedGames.filter(id => id !== gameId));
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quais jogos você joga?</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar"
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Game List */}
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

      {/* Save Selected Games Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Selected games:', selectedGames);
          // You can pass the selected games to another screen or save them
          navigation.navigate('MyProfile', { selectedGames });
        }}
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
    marginBottom: 10,
  },
  searchBar: {
    width: '80%',
    height: 40,
    backgroundColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 20,
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
    width: 60,
    height: 60,
  },
  button: {
    backgroundColor: '#512DA8',
    padding: 15,
    borderRadius: 50,
    width: '70%',
    height: 50,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default GameSelect;
