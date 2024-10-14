import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api'; // Importa seu serviço de API

interface Comment {
  id: number; // ou string, dependendo do tipo do ID
  content: string;
  user: {
    username: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  postId: number; // ID do post
  onClose: () => void; // Função para fechar o modal
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get(`api/post/${postId}/details`);
      console.log('Comentários recebidos:', response.data.comments);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };

  useEffect(() => {
    fetchComments(); // Chama a função ao montar o componente
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await api.post(`api/post/${postId}/comment`, {
          userId, // Você deve pegar o ID do usuário logado
          content: newComment,
        });
        setNewComment(''); // Limpa o campo de entrada
        fetchComments(); // Recarrega os comentários
      } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Agora mesmo';
    } else if (diffInSeconds < 3600) {
      // menos de 1 hora
      const minutes = Math.floor(diffInSeconds / 60);
      return `há ${minutes} min`;
    } else if (diffInSeconds < 86400) {
      // menos de 1 dia
      const hours = Math.floor(diffInSeconds / 3600);
      return `há ${hours} h`;
    } else if (diffInSeconds < 2592000) {
      // menos de 30 dias
      const days = Math.floor(diffInSeconds / 86400);
      return `há ${days} d`;
    } else if (diffInSeconds < 31536000) {
      // menos de 1 ano
      const months = Math.floor(diffInSeconds / 2592000);
      return `há ${months} mês`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `há ${years} ano`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.commentsCounterText}>{comments.length} comentários</Text>
      <FlatList
        style={styles.commentsContainer}
        data={comments}
        keyExtractor={(item, index) => `${item.content}-${index}`} // Chave única
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <View style={styles.photoAndContent}>
              <Image
                source={{
                  uri: 'https://i.pinimg.com/originals/97/fd/40/97fd40b04ea88ae05c66332c64de4fa9.png',
                }} // Placeholder para imagem do usuário
                style={styles.userImage}
              />
              <View style={styles.textContent}>
                <View style={styles.usernameAndTime}>
                  <Text style={styles.text}>{item.user.username}</Text>
                  <Text style={styles.timeText}>{formatDate(item.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{item.content}</Text>
              </View>
            </View>
            <View style={styles.likeButton}>
              <Icon name="heart" size={15} color="#fff" />
            </View>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputAndImage}>
          <Image
            source={{
              uri: 'https://i.pinimg.com/originals/97/fd/40/97fd40b04ea88ae05c66332c64de4fa9.png',
            }} // Placeholder para imagem do usuário
            style={styles.myPhoto}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="white"
            placeholder="Adicione um comentário"
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={handleAddComment} // Adiciona o comentário ao pressionar "Enter"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2B2C',
    padding: 20,
  },
  commentsCounterText: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },

  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  photoAndContent: {
    flexDirection: 'row',
    gap: 10,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  textContent: {},

  commentsContainer: {
    backgroundColor: '#2B2B2C',
    width: '100%',
    marginTop: 30,
  },

  usernameAndTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    color: 'white',
  },
  timeText: {
    color: 'white',
    fontSize: 10,
  },
  commentText: {
    color: 'white',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 10,
    left: '11%',
  },
  input: {
    height: 40,
    width: '90%',
    color: 'white',
    paddingLeft: 10,
    alignSelf: 'center',
  },
  inputAndImage: {
    width: '90%',
    height: 40,
    backgroundColor: '#727272',
    alignSelf: 'center',
    borderRadius: 20,
    flexDirection: 'row',
  },
  myPhoto: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  likeButton: {},
});

export default CommentSection;
