import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, Dimensions} from 'react-native';
import TabMenu from 'components/TabMenu';
import Icon from 'react-native-vector-icons/Feather';
import Header from 'components/Header';


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
    <>
    <ScrollView style={styles.container} >
      
      <Header/>

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
      <View style={styles.postContainer}>
          <View style={styles.post}>
            <View style={styles.user}>
              <Image style={styles.userImage} source={{ uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg' }} />
              <Text style={styles.userName} >User1</Text>
            </View>
            <Text style={styles.postTitle} >Namoral não acredto que fiz isso</Text>
            <View style={styles.postContent}>

            </View>
            <View style={styles.dataView}>

              <View style={styles.postData}>
                <View style={styles.commentsAndLikes} >
                  <Icon name="message-circle" size={24} color="#fff" />
                  <Text style={styles.comments}>10</Text>
                </View>

                <View style={styles.commentsAndLikes} >
                  <Icon name="heart" size={18} color="#fff" />
                  <Text style={styles.likes} >20</Text>
                </View>
              </View>

              <View>
                <Text style={styles.time} >Há 5h</Text>
              </View>

            </View>

          </View>
      </View>
      
    </ScrollView>
    <TabMenu />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    width: "100%",
    height: "100%",
    paddingTop: "10%",
    color: "white",
    paddingBottom: 40
  },
  
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingLeft: "2%",
    paddingRight: "2%"

  },
  searchTitle: {
    color: "white",
    fontSize: 17
  },

  games: {
    paddingLeft: "2%",
    paddingRight: "2%"
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

  post: {
    marginTop: 35,
    

  },
  postContainer: {

  },

  user: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: "2%",
    paddingRight: "2%"
  },
  postContent: {
    width: "100%",
    height: 250,
    backgroundColor: "white",
    // borderRadius: 10,
    marginTop: 5
  },
  postData: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
    
  },

  dataView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "2%",
    paddingRight: "2%"
  },
  postTitle: {
    color: "white",
    marginTop: 10,
    paddingLeft: "2%",
    paddingRight: "2%"
  },
  userName: {
    color: "white"
  },

  comments: {
    color: "white",
  },

  likes: {
    color: "white"
  },
  commentsAndLikes: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
    alignItems: "center"
  },
  time: {
    color: "white",
    opacity: 0.4
  }
});

export default Home;
