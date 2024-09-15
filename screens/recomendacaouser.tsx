/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para os ícones

const GameHubScreen = () => {
  const handlePlay = () => {
    // Ação ao clicar em "Jogar"
    Alert.alert('Jogando', 'Iniciando partida...');
  };

  return (
    <View style={styles.container}>
      {/* Imagem de perfil no canto superior esquerdo */}
      <Image
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Fs2F8U1KRXpToUDd_5GIP1t49MAMU3D0ywGV9I2Iiiu5PzeAf35dcwpl_ng2NS3YPUA&usqp=CAU' }} //  Imagem do user canto esquerdo
        style={styles.profilePic}
      />

      {/* Título e avatar do usuário central */}
      <Text style={styles.title}>GameHub</Text>
      <Image
        source={{ uri: 'https://i.imgur.com/jACdQ9z.png' }} // Imagem central do user, nesse caso, do "@Carlin"
        style={styles.avatar}
      />
      <Text style={styles.username}>@carlin</Text>

      {/* Ícones dos jogos */}
      <View style={styles.gameList}>
        <Image
          source={{ uri: '../assets/gameIcons/fortnite.png' }}
          style={styles.gameIcon}
        />
        <Image
          source={{ uri: '../assets/gameIcons/gtaV.png' }}
          style={styles.gameIcon}
        />
        <Image
          source={{ uri: '../assets/gameIcons/cs2.png' }}
          style={styles.gameIcon}
        />
      </View>

      {/* Status do jogador */}
      <Text style={styles.status}>Procuro alguém pra jogar estou entrando em depressão</Text>

      {/* Botão de Jogar */}
      <TouchableOpacity style={styles.button} onPress={handlePlay}>
        <Text style={styles.buttonText}>Jogar</Text>
      </TouchableOpacity>

      {/* Barra de navegação no rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="compass-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="add-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="mail-outline" size={24} color="black" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
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
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 80,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  username: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  gameList: {
    flexDirection: 'row',
    marginTop: 20,
  },
  gameIcon: {
    width: 48,
    height: 48,
    marginHorizontal: 5,
  },
  status: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#512DA8',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#D1E7F8', // Fundo azul claro
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30,
    width: '60%',
    position: 'absolute',
    bottom: 20,
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C3AED', // Cor roxa do ponto de notificação
  },
});

export default GameHubScreen;