/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios'; 
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

import { RootStackParamList } from '../navigation';

// Definindo o tipo das props
type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      return; // Não faz nada se username ou password estiverem vazios
    }

    try {
      const response = await axios.post('https://gamehub-back-6h0k.onrender.com/api/auth/login', {
        email: username,
        password,
      });
      if (response.status === 200 && response.data.success && response.data.data.user) {
        const userId = response.data.data.user.id
        await AsyncStorage.setItem('userId', userId);
        navigation.replace('Home');
      }
      
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'Invalid username or password'); // Exibe mensagem em caso de falha
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GameHub</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário ou email"
        onChangeText={setUsername}
        value={username}
        placeholderTextColor="#fff"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        placeholderTextColor="#fff"
      />

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => Alert.alert('Forgot Password', 'Implement password recovery logic here.')}
      >
        <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createAccount}
        onPress={() => navigation.navigate('SignupStep1')} // Navegação para SignupStep1
      >
        <Text style={styles.createAccountText}>Criar conta</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
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
  forgotPassword: {
    marginBottom: 15,
    width: '70%',
  },
  forgotPasswordText: {
    color: '#fff',
    alignSelf: 'flex-end',
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
  createAccount: {
    marginTop: 20,
  },
  createAccountText: {
    color: '#fff',
  },
});

export default LoginScreen;
