import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import { Video, ResizeMode as VideoResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
  post: Post;
  navigation: any;
  onCommentButtonClick: (postId: number) => void;
}

const PostFeed: React.FC<PostFeedProps> = ({ post, navigation, onCommentButtonClick }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const videoRef = useRef<any>(null);

  const fetchUser = async (authorId: number) => {
    const response = await api.get(`/api/users/${authorId}`);
    setUser(response.data);
  };

  const fetchPostDetails = async () => {
    const response = await api.get(`/api/post/${post.id}/details`);
    const { _count } = response.data;
    setLikesCount(_count.likes);
    setCommentsCount(_count.comments);
  };

  const handleLike = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    try {
      await api.post(`/api/post/${post.id}/like`, { userId });
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 409) {
            setLikesCount((prev) => Math.max(prev - 1, 0));
            setHasLiked(false);
            console.log('Usuário descurtiu este post.');
          } else {
            console.error('Erro ao dar like:', error.response.data);
          }
        } else {
          console.error('Erro sem resposta do servidor:', error.message);
        }
      } else {
        console.error('Erro desconhecido ao dar like:', error);
      }
    }
  };

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    getUserId();

    if (post) {
      fetchUser(post.authorId);
      fetchPostDetails();
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
        navigation.navigate('MyProfile');
      } else {
        navigation.navigate('Profile', { profileUserId: user.id });
      }
    }
  };

  const navigateToFullScreen = () => {
    if (isVideo(post.imageUrl)) {
      navigation.navigate('FullScreen', { postId: post.id });
    }
  };

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
      {isVideo(post.imageUrl) ? (
        <View>
          <TouchableOpacity onPress={navigateToFullScreen}>
            <Video
              ref={videoRef}
              source={{ uri: post.imageUrl }}
              style={styles.postContent}
              resizeMode={VideoResizeMode.COVER}
              shouldPlay={activeVideo === post.id}
              isMuted={isMuted}
              onError={handleMediaError}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
            <MaterialIcons name={isMuted ? 'volume-off' : 'volume-up'} size={24} color="#fff" />
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
          <TouchableOpacity
            onPress={() => onCommentButtonClick(post.id)}
            style={styles.commentsContainer}>
            <Icon name="message-circle" size={20} color="#fff" />
            <Text style={styles.comments}>{commentsCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike} style={styles.likesContainer}>
            <MaterialIcons
              name={hasLiked ? 'favorite' : 'favorite-border'}
              size={18}
              color={hasLiked ? '#FF4141' : '#fff'}
            />
            <Text style={styles.likes}>{likesCount}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.time}>
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: pt,
            includeSeconds: false,
          }).replace('aproximadamente', '')}
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
    fontSize: 12,
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
