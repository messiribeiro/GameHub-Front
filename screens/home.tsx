import { StackScreenProps } from '@react-navigation/stack';
      import Header from 'components/Header';
      import TabMenu from 'components/TabMenu';
      import React from 'react';
      import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
      import Icon from 'react-native-vector-icons/Feather';

      import { RootStackParamList } from '../navigation'; // Atualize o caminho conforme sua estrutura de pastas

      // Definindo o tipo das props
      type Props = StackScreenProps<RootStackParamList, 'Home'>;

      interface Post {
        id: string;
        username: string;
        caption: string;
        imageUrl: string;
        likes: number;
        comments: number;
        time: string;
      }

      const images = [
        'https://www.malwarebytes.com/wp-content/uploads/sites/2/2024/03/Apex_legends_logo.png?w=1200',
        'https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2024/04/wovr.jpg',
        'https://www.ageofempires.com/wp-content/uploads/2021/10/ogthumb.jpg',
      ];

      const Home = ({ navigation }: Props) => {
        const handleImagePress = (imageUrl: string) => {
          // Navega para a tela FindGamer
          navigation.navigate('FindGamer');
        };

        return (
          <>
            <ScrollView style={styles.container}>
               <Header navigation={navigation} />

              <View style={styles.searchContainer}>
                <Text style={styles.searchTitle}>O que você quer jogar hoje?</Text>
                <Icon name="search" size={24} color="#fff" />
              </View>
              <View style={styles.games}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                  {images.map((imageUrl, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleImagePress(imageUrl)} // Adiciona a função de clique
                      style={styles.imageContainer} // Adiciona um contêiner para definir o tamanho e o espaçamento das imagens
                    >
                      <Image source={{ uri: imageUrl }} style={styles.image} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.postContainer}>
                <View style={styles.post}>
                  <View style={styles.user}>
                    <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
                      <Image
                        style={styles.userImage}
                        source={{
                          uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
                        }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.userName}>User1</Text>
                  </View>
                  <Text style={styles.postTitle}>Namoral não acredto que fiz isso</Text>
                  <Image
                    style={styles.postContent}
                    source={{
                      uri: 'https://cdn.mos.cms.futurecdn.net/csQgknvLgV4P4ABbFSZdrE.jpg',
                    }}
                  />
                  <View style={styles.dataView}>
                    <View style={styles.postData}>
                      <View style={styles.commentsAndLikes}>
                        <Icon name="message-circle" size={24} color="#fff" />
                        <Text style={styles.comments}>10</Text>
                      </View>

                      <View style={styles.commentsAndLikes}>
                        <Icon name="heart" size={18} color="#fff" />
                        <Text style={styles.likes}>20</Text>
                      </View>
                    </View>

                    <View>
                      <Text style={styles.time}>Há 5h</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <TabMenu />
          </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    width: '100%',
    height: '100%',
    paddingTop: '10%',
    color: 'white',
    paddingBottom: 40,
  },

  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },

  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  searchTitle: {
    color: 'white',
    fontSize: 17,
  },

  games: {
    paddingLeft: '2%',
    paddingRight: '2%',
  },

  scrollView: {
    paddingTop: 15,
  },
  imageContainer: {
    marginRight: 10, // Espaçamento entre as imagens
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  post: {
    marginTop: 35,
  },
  postContainer: {},

  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  postContent: {
    width: '100%',
    height: 250,
    backgroundColor: 'white',
    marginTop: 5,
  },
  postData: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },

  dataView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  postTitle: {
    color: 'white',
    marginTop: 10,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  userName: {
    color: 'white',
  },

  comments: {
    color: 'white',
  },

  likes: {
    color: 'white',
  },
  commentsAndLikes: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  time: {
    color: 'white',
    opacity: 0.4,
  },
});

export default Home;
