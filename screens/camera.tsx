import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Camera'>;

const ChatWindow = ({ navigation }: Props) => {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null); // Referência para o CameraView
  const isFocused = useIsFocused();

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo); // Adicione este console.log para depuração
      if (photo && photo.uri) {
        navigation.navigate('PhotoPreview', { photoUri: photo.uri });
      } else {
        console.error('Falha ao tirar a foto.');
      }
    }
  };

  if (!permission) {
    return <View />; // Permissões da câmera ainda estão carregando.
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de permissão para acessar a câmera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.roundButton}>
          <Text style={styles.buttonText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.roundButton} onPress={handleTakePicture}>
              <Text style={styles.buttonText}>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}>
              <Text style={styles.buttonText}>Virar Câmera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000', // Cor de fundo caso a câmera não esteja ativa
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute', // Faz com que o componente seja sobreposto
    bottom: 30, // Posiciona os botões na parte inferior
    left: 0,
    right: 0,
    alignItems: 'center', // Centraliza os botões horizontalmente
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 40, // Torna o botão redondo
    backgroundColor: '#f00', // Cor de fundo do botão
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  flipButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#00f', // Cor do botão para virar a câmera
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // Cor do texto no botão
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    color: '#fff',
    paddingBottom: 20,
  },
});

export default ChatWindow;
