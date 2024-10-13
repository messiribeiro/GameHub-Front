import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import TabMenu from 'components/TabMenu';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api';
import PostList from 'components/PostList'; // Importa o componente PostList

import { RootStackParamList } from '../navigation';

interface UserData {
  id: number;
  username: string;
  profilePictureUrl?: string; // Adiciona o campo para a URL da imagem de perfil
}

interface FollowStats {
  followersCount: number;
  followingCount: number;
}

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile: React.FC<Props> = ({ navigation, route }) => {
  const { profileUserId } = route.params;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [followStats, setFollowStats] = useState<FollowStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animation] = useState(new Animated.Value(1)); // Animação para o botão de seguir
  const [userId, setUserId] = useState<string | null>(null);

  // Obtém o ID do usuário logado
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    })();
  }, []);

  // Busca os dados do usuário, estatísticas de seguidores e verifica se está seguindo
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await api.get(`api/users/${profileUserId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    const getFollowStats = async () => {
      try {
        const response = await api.get(`/api/friendships/stats/${profileUserId}`);
        setFollowStats(response.data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas de seguidores:', error);
      }
    };

    const checkIfFollowing = async () => {
      try {
        const followerId = Number(userId);
        const response = await api.get(
          `/api/friendships/is-following/${followerId}/${profileUserId}`
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Erro ao verificar se o usuário está seguindo:', error);
      }
    };

    if (userId) {
      getUserData();
      getFollowStats();
      checkIfFollowing();
    }
  }, [profileUserId, userId]);

  // Função para seguir o usuário
  const handleFollowUser = async () => {
    try {
      // Animação ao clicar no botão
      Animated.sequence([
        Animated.timing(animation, { toValue: 0.9, duration: 100, useNativeDriver: true }),
        Animated.timing(animation, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      const followerId = Number(userId);
      await api.post('api/friendships/follow', {
        followerId,
        followingId: Number(profileUserId),
      });

      setIsFollowing(true);
      setFollowStats((prevStats) => ({
        ...prevStats,
        followersCount: (prevStats ? prevStats.followersCount : 0) + 1,
      }));
    } catch (error) {
      console.error('Erro ao seguir o usuário:', error);
    }
  };

  // Verifica a URL da imagem de perfil e substitui se for a padrão
  const profileImageUrl =
    userData?.profilePictureUrl === 'https://example.com/profile-picture.jpg'
      ? 'https://media.istockphoto.com/id/1185655985/vector/gamer-portrait-video-games-background-glitch-style-player-vector-illustration-online-user.jpg?s=612x612&w=0&k=20&c=uoy0NDqomF2RzJdrNFQM25WwVahjRggjDHYhQoNnx3M='
      : userData?.profilePictureUrl;

  // Exibe indicador de carregamento enquanto busca os dados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5312C2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={{
            uri: 'https://i.pinimg.com/originals/97/fd/40/97fd40b04ea88ae05c66332c64de4fa9.png',
          }}
          style={styles.bannerImage}
        />
      </View>
      <View style={styles.userProfileActionsView}>
        <View style={styles.userData}>
          <Image
            source={{
              uri: profileImageUrl, // Utiliza a URL verificada
            }}
            style={styles.userImage}
          />
          <Text style={styles.username}>@{userData ? userData.username : 'user'}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Animated.View style={{ transform: [{ scale: animation }] }}>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && { backgroundColor: '#363636' },
              ]}
              onPress={handleFollowUser}
              disabled={isFollowing} // Desativa o botão após seguir
            >
              <Text style={styles.text}>{isFollowing ? 'Seguindo' : 'Seguir'}</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.messageButton}>
            <TouchableOpacity
              onPress={() => {
                if (userData) {
                  navigation.navigate('ChatWindow', {
                    receiverId: userData.id,
                    receiverName: userData.username,
                  });
                }
              }}>
              <Icon name="mail" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.profileData}>
        <Text style={styles.bio}>
          consigo jogar das 22h até às 3h da manhã.. só chamar dm. Jogo fortnite muito bem.. Vem x1
          seu bot
        </Text>
        <View style={styles.followerInformation}>
          <Text style={styles.followerText}>{followStats?.followingCount || 0} seguindo</Text>
          <Text style={styles.followerText}>{followStats?.followersCount || 0} seguidores</Text>
          <Text style={styles.followerText}>0 Publicações</Text>
        </View>
      </View>
      <View style={styles.line} />
      {/* Componente que exibe as publicações do usuário */}
      <PostList userId={profileUserId} />
      <TabMenu navigation={navigation} />
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
    height: '20%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  userProfileActionsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: '8%',
  },
  userData: {
    alignItems: 'center',
    top: -65,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#5312C2',
  },
  username: {
    color: 'white',
    width: 100,
    textAlign: 'center',
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  followButton: {
    width: 100,
    height: 40,
    backgroundColor: '#5312C2',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    width: 40,
    height: 40,
    backgroundColor: '#5312C2',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  profileData: {
    paddingLeft: 15,
    paddingRight: 15,
    height: '8%',
    marginTop: 30,
  },
  followerInformation: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bio: {
    color: '#9E9E9E',
  },
  followerText: {
    color: '#9E9E9E',
    textAlign: 'center',
  },
  line: {
    borderBottomColor: '#9E9E9E',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default Profile;
