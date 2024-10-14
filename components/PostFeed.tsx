import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import { Video, ResizeMode as VideoResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api';

interface Post {
  id: number;
  content: string;
  imageUrl: string;
  authorId: number;
  createdAt: string;
}

interface UserData {
  id: number;
  username: string;
  profilePictureUrl: string;
}

interface PostFeedProps {
  post: Post; // Recebendo um único post como props
  navigation: any; // Adicione a prop de navegação
}

const PostFeed: React.FC<PostFeedProps> = ({ post, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const videoRef = useRef<any>(null);
  const [userId, setUserId] = useState<string | null>(null); // State to hold the logged-in user ID

  const fetchUser = async (authorId: number) => {
    const response = await api.get(`/api/users/${authorId}`);
    setUser(response.data);
  };

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id); // Set the logged-in user ID
    };

    getUserId();

    if (post) {
      fetchUser(post.authorId);
      setLoading(false);
    }
  }, [post]);

  const handleMediaError = () => {
    console.error(`Erro ao carregar a mídia do post com ID: ${post.id}`);
    setMediaError(true);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handlePlayPause = () => {
    setActiveVideo(activeVideo === post.id ? null : post.id);
  };

  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.mov');
  };

  const navigateToProfile = () => {
    if (user) {
      if (user.id.toString() === userId) {
        navigation.navigate('MyProfile'); // Navigate to MyProfile if it's the user's own profile
      } else {
        navigation.navigate('Profile', { profileUserId: user.id }); // Navigate to the profile of another user
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <View style={styles.post}>
      <View style={styles.user}>
        <TouchableOpacity onPress={navigateToProfile}>
          <Image
            style={styles.userImage}
            source={{
              uri: user?.profilePictureUrl || 'https://via.placeholder.com/40',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToProfile}>
          <Text style={styles.username}>@{user?.username || 'Desconhecido'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.postTitle}>{post.content}</Text>
      {/* Renderização condicional para vídeo ou imagem */}
      {isVideo(post.imageUrl) ? (
        <View>
          <TouchableOpacity onPress={handlePlayPause}>
            <Video
              ref={videoRef}
              source={{ uri: post.imageUrl }}
              style={styles.postContent}
              resizeMode={VideoResizeMode.CONTAIN}
              shouldPlay={activeVideo === post.id}
              isMuted={isMuted}
              onError={handleMediaError}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
            <Icon name={isMuted ? 'volume-x' : 'volume-2'} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <Image
          style={styles.postContent}
          source={{ uri: post.imageUrl }}
          onError={handleMediaError}
        />
      )}
      <View style={styles.dataView}>
        <View style={styles.postData}>
          <View style={styles.commentsContainer}>
            <Icon name="message-circle" size={22} color="#fff" />
            <Text style={styles.comments}>10</Text>
          </View>
          <View style={styles.likesContainer}>
            <Icon name="heart" size={18} color="#fff" />
            <Text style={styles.likes}>20</Text>
          </View>
        </View>
        <Text style={styles.time}>
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: pt,
            includeSeconds: false, // Remove "aproximadamente"
          }).replace('aproximadamente', '')}{' '}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    marginBottom: 20,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '2%',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  username: {
    color: 'white',
    textAlign: 'center',
    marginLeft: 5,
  },
  postTitle: {
    color: 'white',
    marginTop: 5,
    paddingLeft: '2%',
  },
  postContent: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
    marginTop: 10,
  },
  muteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    padding: 8,
  },
  dataView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '2%',
    paddingRight: '2%',
    marginTop: 10,
  },
  postData: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  comments: {
    color: 'white',
  },
  likes: {
    color: 'white',
  },
  time: {
    color: 'white',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export default PostFeed;
