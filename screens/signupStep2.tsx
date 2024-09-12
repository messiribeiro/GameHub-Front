/* eslint-disable prettier/prettier */
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { RootStackParamList } from '../navigation';

// Definindo o tipo das props
type Props = StackScreenProps<RootStackParamList, 'SignupStep2'>;

const SignUpStep2 = ({ navigation }: Props) => {
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie uma senha</Text>
      <Text style={styles.subtitle}>Sua senha deve ter, no mínimo, 8 caracteres</Text>

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        placeholderTextColor="#fff"
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignupStep3')}>
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
    width: "50%",
    fontWeight: 'bold',
    color: '#fff',
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "200",
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

export default SignUpStep2;
