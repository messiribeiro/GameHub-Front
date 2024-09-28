/* eslint-disable prettier/prettier */
import { StackScreenProps } from '@react-navigation/stack';
import TabMenu from 'components/TabMenu';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api';

import { RootStackParamList } from '../navigation';

interface UserData {
  id: number;
  username: string;
}

// Defining the type of props
type Props = StackScreenProps<RootStackParamList, 'Profile'>;


const Profile: React.FC<Props> = ({ navigation, route }) => {
  const { profileUserId } = route.params; // Get profileUserId from route.params

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(()=>{
    const getUserData = async () => {
      console.log(profileUserId);
      setUserData((await api.get(`api/users/${profileUserId}`)).data); 
      
    }
    getUserData();
  },[])
  

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Image source={{ uri: "https://s3.static.brasilescola.uol.com.br/be/2023/09/1-escudo-do-corinthians.jpg" }} style={styles.bannerImage} />
      </View>
      <View style={styles.userProfileActionsView}>
        <View style={styles.userData}>
          <Image source={{ uri: "https://img.a.transfermarkt.technology/portrait/big/489893-1720056861.jpg?lm=1" }} style={styles.userImage} />
          <Text style={styles.username}>@{userData ? userData.username : "user"}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.followButton}>
            <Text style={styles.text}>seguir</Text>
          </View>
          <View style={styles.messageButton}>
            <Icon name="mail" size={24} color="#fff" />

          </View>
        </View>
        
      
      </View> 
      <View style={styles.profileData} >
          <Text style={styles.bio}>
            consigo jogar das 22h até às 3h da manhã.. só chamar dm. Jogo fortnite muito bem.. Vem x1 seu bot
          </Text>
          <View style={styles.followerInformation}>
            <Text style={styles.followerText}>32 seguindo</Text>
            <Text style={styles.followerText}>5 seguidores</Text>
            <Text style={styles.followerText}>45 Publicações</Text>
          </View>
      </View>
      <View style={styles.line}/>
      <View style={styles.posts}>
        <Text style={styles.messageText}>@{userData ? userData.username : "..."} ainda não fez uma publicação</Text>
      </View>
      <TabMenu />

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  banner: {
    width: '100%',
    resizeMode: 'cover',  
    height: "20%",
  },
  bannerImage: {
    width: "100%",
    height: "100%"
  },
  userProfileActionsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    height: "8%",
  },
  userData: {
    alignItems: "center",
    top: -65,

  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#5312C2",

  },
  username: {
    color: "white",
    width: 100,
    textAlign: "center",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 5,    
  },
  followButton: {
    width: 100,
    height: 40,
    backgroundColor: "#5312C2",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center"
  },
  messageButton: {
    width: 40,
    height: 40,
    backgroundColor: "#5312C2",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  },
  profileData: {
    paddingLeft: 15,
    paddingRight: 15,
    height: "8%",
    marginTop: 30,
  },
  followerInformation: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bio: {
    color: "white",
  },
  followerText: {
    color: "white",
    fontSize: 13,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#FFFFFF",
    opacity: 0.19,
    marginTop: 15,
  },
  posts: {
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    color: "white",
  }
});


export default Profile;
