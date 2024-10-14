import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import TabMenu from 'components/TabMenu';
import { Video, ResizeMode as VideoResizeMode } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api';

import { RootStackParamList } from '../navigation';

interface UserData {
  id: number;
  username: string;
  profilePictureUrl?: string;
}

interface FollowStats {
  followersCount: number;
  followingCount: number;
}

interface Post {
  id: number;
  content: string;
  imageUrl: string;
  authorId: number;
  createdAt: string;
}

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile: React.FC<Props> = ({ navigation, route }) => {
  const { profileUserId } = route.params;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [followStats, setFollowStats] = useState<FollowStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animation] = useState(new Animated.Value(1));
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const numColumns = 3; // Definindo o número de colunas

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    })();
  }, []);

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

    const fetchPosts = async () => {
      try {
        const response = await api.get(`api/post/user/${profileUserId}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      }
    };

    if (userId) {
      getUserData();
      getFollowStats();
      checkIfFollowing();
      fetchPosts();
    }
  }, [profileUserId, userId]);

  const handleFollowUser = async () => {
    try {
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
        followingCount: prevStats?.followingCount || 0,
      }));
    } catch (error) {
      console.error('Erro ao seguir o usuário:', error);
    }
  };

  const profileImageUrl =
    userData?.profilePictureUrl === 'https://example.com/profile-picture.jpg'
      ? 'https://media.istockphoto.com/id/1185655985/vector/gamer-portrait-video-games-background-glitch-style-player-vector-illustration-online-user.jpg?s=612x612&w=0&k=20&c=uoy0NDqomF2RzJdrNFQM25WwVahjRggjDHYhQoNnx3M='
      : userData?.profilePictureUrl;

  const renderPost = ({ item }: { item: Post }) => {
    const isVideo = item.imageUrl.endsWith('.mp4');

    return (
      <View style={styles.post}>
        {isVideo ? (
          <Video
            source={{ uri: item.imageUrl }}
            style={styles.video}
            shouldPlay={false}
            resizeMode={VideoResizeMode.COVER}
            isLooping
          />
        ) : (
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        )}
      </View>
    );
  };

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
          <Image source={{ uri: profileImageUrl }} style={styles.userImage} />
          <Text style={styles.username}>@{userData ? userData.username : 'user'}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Animated.View style={{ transform: [{ scale: animation }] }}>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && { backgroundColor: '#363636' }]}
              onPress={handleFollowUser}
              disabled={isFollowing}>
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
          <Text style={styles.followerText}>{posts.length} Publicações</Text>
        </View>
      </View>
      <View style={styles.line} />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.posts}
        numColumns={numColumns} // Usando a variável para definir colunas
        key={`grid-${numColumns}`} // Adicionando uma chave dinâmica
      />
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
    color: '#fff',
  },
  profileData: {
    padding: 10,
    marginTop: 10,
  },
  bio: {
    color: 'white',
    marginVertical: 5,
  },
  followerInformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  followerText: {
    color: 'white',
  },
  line: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 10,
  },
  post: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posts: {
    paddingBottom: 20,
  },
});

export default Profile;
