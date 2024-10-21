import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import api from '../services/api';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'EditProfile'>;

interface UserData {
  username: string;
  bio?: string; // Add bio if needed
  profilePictureUrl: string; // You can keep this for displaying image
}

const EditProfile: React.FC<Props> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState(''); // Include bio if you allow users to update it
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        try {
          const response = await api.get(`/api/users/${userId}`);
          const { username, bio, profilePictureUrl } = response.data;
          setUserData(response.data);
          setUsername(username);
          setBio(bio || ''); // Initialize bio
          setProfilePictureUrl(profilePictureUrl);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!username) {
        Alert.alert('Erro', 'O campo Nome de usuário precisa ser preenchido.');
        return;
      }

      const updateData: any = { username }; // Only include username

      // Include bio if it is not empty
      if (bio) updateData.bio = bio;

      if (userId) {
        const response = await api.put(`/api/users/${userId}`, updateData);
        if (response.status === 200) {
          Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
          navigation.goBack(); // Go back to the profile page
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
        }
      }
    } catch (error) {
      if (error.response) {
        console.error('Erro na resposta da API:', error.response.data);
        Alert.alert('Erro', `Erro na resposta da API: ${error.response.data.message}`);
      } else {
        console.error('Erro ao configurar a requisição:', error.message);
        Alert.alert('Erro', 'Erro ao processar sua solicitação.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto de Perfil</Text>
      <Image
        source={{ uri: profilePictureUrl || 'https://via.placeholder.com/100' }}
        style={styles.userImage}
      />
      <Text style={styles.label}>URL da Foto de Perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="URL da foto de perfil"
        value={profilePictureUrl}
        onChangeText={setProfilePictureUrl} // Optionally allow users to change the URL
      />
      <Text style={styles.label}>Nome de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        placeholder="Consigo jogar das 22h até às 3h da manhã..."
        value={bio}
        onChangeText={setBio}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  label: {
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#512DA8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default EditProfile;
