import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import api from 'services/api';

interface Post {
  id: number;
  imageUrl?: string;
  videoUrl?: string;
  caption: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

const PostList: React.FC<{ userId: string }> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca as publicações do usuário
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/api/posts/user/${userId}`);
        setPosts(response.data);
      } catch (err) {
        setError('Erro ao carregar publicações. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  // Exibe um post
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      {item.videoUrl ? (
        <Text style={styles.mediaText}>Vídeo: {item.videoUrl}</Text> // Placeholder para o vídeo
      ) : (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      )}
      <Text style={styles.caption}>{item.caption}</Text>
      <View style={styles.postStats}>
        <Text style={styles.statsText}>{item.likesCount} Curtidas</Text>
        <Text style={styles.statsText}>{item.commentsCount} Comentários</Text>
      </View>
    </View>
  );

  // Exibe indicador de carregamento ou erro
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5312C2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.postList}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  postList: {
    padding: 10,
  },
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  caption: {
    color: '#FFFFFF',
    marginVertical: 5,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statsText: {
    color: '#9E9E9E',
  },
});

export default PostList;