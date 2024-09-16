import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

import { RootStackParamList } from '../navigation';
import api from '../services/api'; // Importa a instância configurada

// Definindo o tipo das props
type Props = StackScreenProps<RootStackParamList, 'SignupStep3'>;

const SignUpStep3 = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    try {
      // Recuperar dados do AsyncStorage
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('userPassword');

      if (!username || !password) {
        Alert.alert('Erro', 'Dados de usuário não encontrados no armazenamento.');
        return;
      }

      // Fazer a requisição para criar um novo usuário
      const response = await api.post('/api/auth/signup', {
        username,
        email,
        password,
        profilePicture: 'https://example.com/default-profile-picture.jpg',
        game: [1, 2, 3], // Adicione os jogos de interesse se necessário
      });

      if (response.status == 500) {
        console.log(response);
      }
      if (response.status === 201) {
        console.log('usuário cadastrado');
        try {
          const loginResponse = await api.post('/api/auth/login', {
            email,
            password,
          });
          console.log(email, password);
          console.log(loginResponse);
          if (loginResponse.status === 201) {
            const { id } = loginResponse.data.data.user;

            await AsyncStorage.setItem('userId', id.toString());

            navigation.navigate('GameSelect');
          } else {
            Alert.alert('Erro', 'Falha ao fazer login após o cadastro.');
          }
        } catch (loginError) {
          Alert.alert('Erro', 'Erro ao tentar fazer login.');
          console.error(loginError);
        }

        navigation.navigate('GameSelect');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao criar a conta.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informe seu email</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        placeholderTextColor="#fff"
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Avançar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    width: '60%',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 35,
  },
  input: {
    width: '70%',
    height: 50,
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
    borderColor: 'white',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#512DA8',
    padding: 15,
    borderRadius: 50,
    width: '70%',
    height: 50,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default SignUpStep3;
