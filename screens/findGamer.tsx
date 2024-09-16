/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para os ícones
import TabMenu from 'components/TabMenu';
import Header from 'components/Header';
const FindGamer = () => {
  const handlePlay = () => {
    // Ação ao clicar em "Jogar"
    Alert.alert('Jogando', 'Iniciando partida...');
  };

  return (
    <>
      <View style={styles.container}>
        <Header/>
        <View style={styles.gamerData}>
          <Image source={{ uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg' }} style={styles.userImage} />
          <Text style={styles.username} >@joazin</Text>
          <View style={styles.bio} >
            <Text style={styles.gamesText}>Jogos</Text>
            <View style={styles.games}>
                <Image style={styles.gameImage} source={{ uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg' }} />
                <Image style={styles.gameImage} source={{ uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg' }} />
                <Image style={styles.gameImage} source={{ uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg' }} />

            </View>
            
            <Text style={styles.bioText}>Procuro alguém pra jogar estou entrando em depressão</Text>
          </View>
          <TouchableOpacity style={styles.invite}>
            <Text style={styles.inviteText}>Convidar</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      
      <TabMenu/>
     </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: "10%"
    
  },
  gamerData:{
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: "40%"
  },

  userImage:{
    width: 100,
    height: 100,
    borderRadius: 100
  },
  username: {
    color: "white",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700"
  },
  bio: {
    backgroundColor: "#2B2B2C",
    width: "80%",
    height: 150,
    marginTop: 30,
    padding: 15,
    borderRadius: 10
  },
  gamesText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500"
  },
  gameImage: {
    width: 40,
    height: 40,
    borderRadius: 10
  },
  bioText: {
    color: "white",
    marginTop: 15,
    fontSize: 14,
    fontWeight: "300"
  },
  games: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10
  },
  invite: {
    width: 130,
    height: 40,
    backgroundColor: "#5312C2",
    borderRadius: 10,
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inviteText: {
    color: "white"
  }
});

export default FindGamer;