import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Video, ResizeMode as VideoResizeMode } from 'expo-av';
import api from 'services/api';
import { formatDistanceToNow } from 'date-fns'; // Importando a função de formatação
import { pt } from 'date-fns/locale/pt'; // Importando a localização em português

interface Post {
  id: number;
  content: string;
  imageUrl: string;
  authorId: number;
  createdAt: string; // Mantenha o tipo como string para formatação
}

interface UserData {
  id: number;
  username: string;
  profilePictureUrl: string;
}

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ [key: number]: UserData }>({});
  const [mediaError, setMediaError] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const response = await api.get('/api/post');
        const postList: Post[] = response.data;
        setPosts(postList);

        // Obtenha os IDs únicos dos autores
        const authorIds = [...new Set(postList.map((post) => post.authorId))];

        // Busque os dados dos usuários autores dos posts
        const userResponses = await Promise.all(authorIds.map((id) => api.get(`/api/users/${id}`)));

        // Mapeie os dados dos usuários por id
        const userData = userResponses.reduce(
          (acc, res) => {
            const user: UserData = res.data;
            acc[user.id] = user;
            return acc;
          },
          {} as { [key: number]: UserData }
        );

        setUsers(userData); // Armazene os dados dos usuários
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar posts e usuários:', error);
        setLoading(false);
      }
    };

    fetchPostsAndUsers();
  }, []);

  // Função para verificar se a mídia é um vídeo
  const isVideo = (url: string | undefined) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.avi');
  };

  // Lidar com erro na mídia
  const handleMediaError = (postId: number) => {
    setMediaError((prevState) => ({
      ...prevState,
      [postId]: true,
    }));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <View style={styles.container}>
      {posts.map((post) => (
        <View key={post.id} style={styles.post}>
          <View style={styles.user}>
            <Image
              style={styles.userImage}
              source={{
                uri: users[post.authorId]?.profilePictureUrl || 'https://via.placeholder.com/40', // Placeholder caso não encontre a imagem
              }}
            />
            <Text style={styles.username}>@{users[post.authorId]?.username || 'Desconhecido'}</Text>
          </View>
          <Text style={styles.postTitle}>{post.content}</Text>

          {/* Renderização condicional para vídeo ou imagem */}
          {isVideo(post.imageUrl) ? (
            <Video
              source={{ uri: post.imageUrl }}
              style={styles.postContent}
              resizeMode={VideoResizeMode.CONTAIN}
              shouldPlay={false}
              useNativeControls
              onError={() => handleMediaError(post.id)}
            />
          ) : (
            <Image
              style={styles.postContent}
              source={{ uri: post.imageUrl }}
              onError={() => handleMediaError(post.id)}
            />
          )}

          <View style={styles.dataView}>
            <View style={styles.postData}>
              <Icon name="message-circle" size={24} color="#fff" />
              <Text style={styles.comments}>10</Text>
              <Icon name="heart" size={18} color="#fff" />
              <Text style={styles.likes}>20</Text>
            </View>
            {/* Formatando a data criada */}
            <Text style={styles.time}>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: pt, // Usando a localização em português
              })}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  post: {
    marginBottom: 20,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '2%',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  username: {
    color: 'white',
    width: 100,
    textAlign: 'center',
    marginTop: 5,
  },
  postTitle: {
    color: 'white',
    marginTop: 10,
    paddingLeft: '2%',
  },
  postContent: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
    marginTop: 10,
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
    gap: 10,
  },
  comments: {
    color: 'white',
    marginLeft: 10,
  },
  likes: {
    color: 'white',
    marginLeft: 10,
  },
  time: {
    color: 'white',
  },
});

export default PostFeed;
