import { useFocusEffect } from '@react-navigation/native'; // Hook para lidar com ciclo de vida de foco
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import GoBackAlert from '../components/GoBackAlert'; // Certifique-se de importar o seu modal
import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'EditPostInfo'>;

const EditPostInfo = ({ navigation, route }: Props) => {
  const { photoUri, cameraType } = route.params;
  const isFrontCamera = cameraType === 'front';
  const imageStyle = isFrontCamera ? styles.invertedImagePreview : styles.imagePreview;

  const [isModalVisible, setModalVisible] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null); // Ref para guardar o unsubscribe

  useFocusEffect(
    React.useCallback(() => {
      // Adiciona o listener se não estiver presente
      if (!unsubscribeRef.current) {
        unsubscribeRef.current = navigation.addListener('beforeRemove', (e) => {
          e.preventDefault(); // Impede a navegação
          setModalVisible(true); // Exibe o modal de confirmação
        });
      }

      return () => {
        // Remove o listener ao desfocar
        if (unsubscribeRef.current) {
          unsubscribeRef.current(); // Executa o unsubscribe
          unsubscribeRef.current = null; // Reseta a ref
        }
      };
    }, [navigation])
  );

  const handleConfirmExit = () => {
    setModalVisible(false); // Fecha o modal

    setTimeout(() => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current(); // Remove o listener manualmente
        unsubscribeRef.current = null; // Limpa a ref
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Camera' }], // Reseta para a tela da câmera
      });
    }, 200); // Pequeno delay para garantir que o modal feche antes de navegar
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon style={styles.arrowLeft} name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Verifique sua Imagem</Text>
        </View>
        <View style={styles.imageContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={imageStyle} resizeMode="cover" />
          ) : (
            <Text style={styles.text}>Imagem não disponível</Text>
          )}
        </View>
        <View style={styles.subtitleInput}>
          <TextInput
            style={styles.input}
            placeholder="Adicione uma legenda à sua imagem"
            placeholderTextColor="white"
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Avançar</Text>
          <Icon name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>

        <GoBackAlert
          visible={isModalVisible}
          title="Descartar Imagem?"
          message="As alterações serão perdidas"
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirmExit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1E',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    justifyContent: 'center',
  },
  arrowLeft: {
    position: 'absolute',
  },
  title: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 80,
    width: '70%',
    height: '35%',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  invertedImagePreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    transform: [{ scaleX: -1 }],
  },
  subtitleInput: {
    padding: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    color: 'white',
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    marginTop: 60,
  },
});

export default EditPostInfo;
