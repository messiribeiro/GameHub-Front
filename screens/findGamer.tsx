/* eslint-disable import/order */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import TabMenu from 'components/TabMenu';
import Header from 'components/Header';

const { height } = Dimensions.get('window');

const users = [
  {
    id: '1',
    username: '@joazin',
    bioText: 'Procuro alguém pra jogar, estou entrando em depressão',
    games: [
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
    ],
  },
  {
    id: '2',
    username: '@gamer2',
    bioText: 'Vamos jogar juntos!',
    games: [
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
    ],
  },
  {
    id: '3',
    username: '@gamer2',
    bioText: 'Vamos jogar juntos!',
    games: [
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
    ],
  },
  {
    id: '4',
    username: '@gamer2',
    bioText: 'Vamos jogar juntos!',
    games: [
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
    ],
  },
  {
    id: '5',
    username: '@gamer2',
    bioText: 'Vamos jogar juntos!',
    games: [
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
    ],
  },
  {
    id: '6',
    username: '@gamer2',
    bioText: 'Vamos jogar juntos!',
    games: [
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
      'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
    ],
  },
  // Adicione mais usuários aqui
];

const FindGamer = () => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const handleSwipeDown = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.gamerData}>
      <Image source={{ uri: item.games[0] }} style={styles.userImage} />
      <Text style={styles.username}>{item.username}</Text>
      <View style={styles.bio}>
        <Text style={styles.gamesText}>Jogos</Text>
        <View style={styles.games}>
          {item.games.map((game, index) => (
            <Image key={index} style={styles.gameImage} source={{ uri: game }} />
          ))}
        </View>
        <Text style={styles.bioText}>{item.bioText}</Text>
      </View>
      <TouchableOpacity style={styles.invite}>
        <Text style={styles.inviteText}>Convidar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Header />
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          initialScrollIndex={currentUserIndex}
          getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
          onMomentumScrollEnd={(event) => {
            const index = Math.floor(event.nativeEvent.contentOffset.y / height);
            setCurrentUserIndex(index);
          }}
          showsVerticalScrollIndicator={false}
          snapToInterval={height} // Define a altura do snap
          snapToAlignment="start"
          decelerationRate="fast"
          style={{ flex: 1 }}
        />
      </View>
      <TabMenu />
    </>
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
  gameImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  bioText: {
    color: 'white',
    marginTop: 15,
    fontSize: 14,
    fontWeight: '300',
  },
  games: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
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
});

export default FindGamer;
