import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

interface Post {
  id: string;
  username: string;
  caption: string;
  imageUrl: string;
  likes: number;
  comments: number;
  time: string;
}

const posts: Post[] = [
  {
    id: '1',
    username: 'User1',
    caption: 'Namoral n tô acreditando q fiz isso kkk',
    imageUrl: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
    likes: 50,
    comments: 12,
    time: 'Há 5h',
  },
  {
    id: '2',
    username: 'User1',
    caption: 'Namoral n tô acreditando q fiz isso kkk',
    imageUrl: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
    likes: 50,
    comments: 12,
    time: 'Há 5h',
  },
];

const images = [
  'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
  'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
  'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
  'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
  'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
  'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
  'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',

];

const Home = () => {
  return (
    <View style={styles.container} >
      <View style={styles.header}>
        <Image style={styles.userImage} source={{ uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg' }} />
        <Text style={styles.title}>GameHub</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle} >O que você quer jogar hoje?</Text>
        <Icon name="search" size={24} color="#fff" />
      </View>
      <View style={styles.games}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView} >
            {images.map((imageUrl, index) => (
            <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
          ))}     
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    width: "100%",
    height: "100%",
    paddingTop: "10%",
    padding: "5%",
    color: "white"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignSelf: "flex-start"
  },
  title: {
    fontSize: 20,
    color: "white",
    position: 'absolute', // Usa posicionamento absoluto para centralizar
    left: '50%', // Move o elemento 50% da largura da tela
    transform: [{ translateX: -50 }],
    fontWeight: "800"
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  searchTitle: {
    color: "white",
    fontSize: 17
  },

  games: {

  },

  scrollView: {
    paddingTop: 15,
  },
  image: {
    width: 70, // Defina a largura desejada para suas imagens
    height: 70, // Defina a altura desejada para suas imagens
    borderRadius: 10, // Bordas arredondadas, opcional
    marginRight: 10, // Espaçamento entre as imagens
  },
});

export default Home;
