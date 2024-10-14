import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

interface Comment {
  id: number;
  user: string;
  text: string;
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment(''); // Limpa o campo após adicionar
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.commentList}>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <Text style={styles.user}>{comment.user}</Text>
            <Text style={styles.text}>{comment.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Adicione um comentário..."
          placeholderTextColor="#ccc"
        />
        <Button title="Enviar" onPress={handleAddComment} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#121212',
  },
  commentList: {
    maxHeight: 150,
  },
  comment: {
    marginBottom: 10,
  },
  user: {
    fontWeight: 'bold',
    color: 'white',
  },
  text: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    color: 'white',
    marginRight: 10,
  },
});

export default CommentSection;
