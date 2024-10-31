import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'GamePreview'>;

const GamePreview = ({ navigation, route }: Props) => {
  const [gameName, setGameName] = useState<string | null>(null);
  const [gameDescription, setGameDescription] = useState<string | null>(null);
  const [gameCategory, setGameCategory] = useState<string | null>(null);
  const [gameImage, setGameImage] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedGameImage = await AsyncStorage.getItem('gameImage');
        const storedGameName = await AsyncStorage.getItem('gameName');
        const storedGameCategory = await AsyncStorage.getItem('gameCategory');
        const storedGameDescription = await AsyncStorage.getItem('gameDescription');

        console.log(storedGameDescription);
        setGameName(storedGameName);
        setGameCategory(storedGameCategory);
        setGameDescription(storedGameDescription);
        setGameImage(storedGameImage);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData(); // Chame a função para buscar os dados

    // Defina a data atual
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    setCurrentDate(date.toLocaleDateString('pt-BR', options)); // Formate a data
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.gamePreview}>
        <Text style={styles.gameName}>{gameName}</Text>
        <View style={styles.imageAndData}>
          <Image
            source={gameImage ? { uri: gameImage } : require('')}
            style={styles.gameImage}
            onError={() => console.error('Erro ao carregar imagem do jogo')}
          />
          <View style={styles.data}>
            <Text style={styles.category}>{gameCategory}</Text>
            <Text style={styles.text}>Publicado em {currentDate}</Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <ScrollView>
            <Text style={styles.gameDescription}>{gameDescription}</Text>
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.textButton}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameDescription: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
  },
  data: {},
  gameImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: '#701EFF',
  },
  imageAndData: {
    flexDirection: 'row',
    gap: 10,
  },
  gameName: {
    color: 'white',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
  },
  gamePreview: {
    width: '80%',
    backgroundColor: '#2B2B2C',
    borderRadius: 10,
    minHeight: 200,
    padding: 20,
  },
  header: {},
  text: {
    color: 'white',
    width: '80%',
  },
  category: {
    color: 'white',
    marginBottom: 10,
  },
  textButton: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    backgroundColor: '#5312C2',
    height: 50,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  descriptionContainer: {
    maxHeight: 200,
  },
});

export default GamePreview;
