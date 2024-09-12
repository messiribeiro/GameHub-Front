/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic here
    // Replace with your actual authentication logic
    Alert.alert('Login Successful!', 'Welcome!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GameHub</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário ou email"
        onChangeText={setUsername}
        value={username}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => Alert.alert('Forgot Password', 'Implement password recovery logic here.')}>
        <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Ou</Text>

      <TouchableOpacity
        style={styles.createAccount}
        onPress={() => Alert.alert('Create Account', 'Implement account creation logic here.')}>
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
    width: '80%',
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
  },
  forgotPassword: {
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#512DA8',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    color: '#fff',
    marginTop: 15,
  },
  createAccount: {
    marginTop: 20,
  },
  createAccountText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
