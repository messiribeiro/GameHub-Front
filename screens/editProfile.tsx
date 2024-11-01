/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList } from '../navigation';
import api from '../services/api';

type Props = StackScreenProps<RootStackParamList, 'EditProfile'>;

interface UserData {
  username: string;
  bio?: string;
  profilePictureUrl: string;
}

const EditProfile: React.FC<Props> = ({ navigation, route }) => {
  const { profilePictureUri } = route.params || {}; // Capturar a URI da imagem se existir

  const [userData, setUserData] = useState<UserData | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
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
          setBio(bio || '');
          setProfilePictureUrl(profilePictureUrl);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Atualizar a URL da imagem do perfil se a URI estiver disponível
    if (profilePictureUri) {
      setProfilePictureUrl(profilePictureUri); // Atualizar com a URI da imagem
    }
  }, [profilePictureUri]); // Dependência de profilePictureUri

const handleSave = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');

    if (!username) {
      Alert.alert('Erro', 'O campo Nome de usuário precisa ser preenchido.');
      return;
    }

    // Criar FormData apenas se houver alterações
    const updateData = new FormData();
    let hasChanges = false; // Variável para verificar se houve alterações

    if (username !== userData?.username) {
      updateData.append('username', username);
      hasChanges = true; // Marcar que houve uma alteração
    }

    if (bio !== userData?.bio) {
      updateData.append('bio', bio);
      hasChanges = true; // Marcar que houve uma alteração
    }

    if (profilePictureUrl) {
      const fileInfo = await FileSystem.getInfoAsync(profilePictureUrl);
      if (fileInfo.exists) {
        const fileExtension = fileInfo.uri.split('.').pop()?.toLowerCase();
        console.log('Extensão do arquivo:', fileExtension); // Verifique a extensão do arquivo

        let fileType = '';
        if (fileExtension === 'png') {
          fileType = 'image/png';
        } else if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
          fileType = 'image/jpeg';
        } else {
          console.error('Tipo de arquivo não suportado:', fileExtension);
          return;
        }

        const file = {
          uri: profilePictureUrl,
          name: `profilePhotoByUser-${userId}.${fileExtension}`,
          type: fileType,
        };

        updateData.append('profilePicture', file as any);
        hasChanges = true;
      } else {
        console.error('Arquivo não existe no caminho especificado.');
        return;
      }
    } else {
      console.error('photoUri não está definido.');
      return;
    }

    // Se não houver alterações, apenas voltar
    if (!hasChanges) {
      navigation.goBack();
      return;
    }

    if (userId) {
      const response = await api.put(`/api/users/${userId}`, updateData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Necessário para envio de FormData
        },
      });
      if (response.status === 200) {
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
      }
    }
  } catch (error: any) { // Usando `any` para evitar o erro de tipo 'unknown'
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.data);
      Alert.alert('Erro', `Erro na resposta da API: ${error.response.data.message}`);
    } else if (error instanceof Error) {
      console.error('Erro ao configurar a requisição:', error.message);
      Alert.alert('Erro', 'Erro ao processar sua solicitação: ' + error.message);
    } else {
      console.error('Erro desconhecido:', error);
      Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
    }
  }
};


  const navigateToCamera = () => {
    navigation.navigate('Camera', { isProfilePicture: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <Text style={styles.label}>Foto de Perfil</Text>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: profilePictureUrl || 'https://via.placeholder.com/100' }}
            style={styles.userImage}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={navigateToCamera}>
            <Icon name="camera-alt" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

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
    padding: 30,
    paddingTop: 70,
  },
  photoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
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
  cameraIcon: {
    position: 'absolute',
    bottom: '37%',
    right: '8%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 5,
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
