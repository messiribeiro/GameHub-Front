import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import ImagePreview from 'components/ImagePreview';
import VideoPreview from 'components/VideoPreview';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Album } from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, StatusBar, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Camera'>;

const CameraScreen = ({ navigation }: Props) => {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [permissionResponse, requestMediaPermission] = MediaLibrary.usePermissions();
  const [lastPhotoUri, setLastPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  useEffect(() => {
    getAlbums();
    setPhoto(null);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setPhoto(null);
      getAlbums();
    }, [])
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  async function getAlbums() {
    if (permissionResponse?.status !== 'granted') {
      await requestMediaPermission();
    }

    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);

    const assets = await MediaLibrary.getAssetsAsync({
      first: 1,
      sortBy: MediaLibrary.SortBy.creationTime,
      mediaType: MediaLibrary.MediaType.photo,
    });

    if (assets.assets.length > 0) {
      setLastPhotoUri(assets.assets[0].uri);
    }
  }

  function toggleCameraFacing() {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      if (isVideoMode) {
        if (!isRecording) {
          console.log('Iniciando a gravação de vídeo...');
          setIsRecording(true);
          try {
            const video = await cameraRef.current.recordAsync();
            if (video && video.uri) {
              console.log('Vídeo gravado em:', video.uri);
              setVideoUri(video.uri); // Armazena a URI do vídeo
            } else {
              console.error('Vídeo não gravado, objeto vídeo é indefinido ou não contém URI');
            }
          } catch (error) {
            console.error('Erro ao gravar o vídeo:', error);
          } finally {
            setIsRecording(false);
          }
        } else {
          console.log('Parando a gravação de vídeo...');
          cameraRef.current.stopRecording();
          setIsRecording(false);
        }
      } else {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync();
          if (photo && photo.uri) {
            // Verifica se photo e photo.uri estão definidos
            console.log(photo.uri); // Exibe a URI da foto no terminal
            setLastPhotoUri(photo.uri); // Armazena a URI da foto tirada
            setPhoto(photo.uri);
          } else {
            console.error('Failed to take photo'); // Log de erro
          }
        }
      }
    }
  }

  const handleBack = () => {
    setPhoto(null);
    setVideoUri(null);
  };
  function handleForward() {
    console.log(videoUri); // Isso vai mostrar a URI do vídeo corretamente

    // Verifica se está no modo de vídeo e se a URI do vídeo é válida
    const uriToSend = isVideoMode && videoUri ? videoUri : photo;

    navigation.navigate('EditPostInfo', {
      photoUri: uriToSend || 'erro', // Se nenhuma URI válida, envia 'erro'
      cameraType: facing,
    });
  }

  return (
    <View style={styles.container}>
      {videoUri ? (
        <VideoPreview
          VideoUri={videoUri}
          onBack={handleBack}
          onForward={handleForward}
          cameraFacing={facing}
        />
      ) : photo ? (
        <ImagePreview
          imageUri={photo}
          onBack={handleBack}
          onForward={handleForward}
          cameraFacing={facing}
        />
      ) : (
        <>
          <StatusBar hidden />
          <CameraView
            mode={isVideoMode ? 'video' : 'picture'}
            style={styles.camera}
            facing={facing}
            ref={cameraRef}>
            <View style={styles.screenContainer}>
              <View style={styles.changeModeContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsVideoMode(false);
                    console.log('Modo foto ativado');
                  }}>
                  <Text style={[styles.text, !isVideoMode && styles.textSelected]}>Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsVideoMode(true);
                    console.log('Modo vídeo ativado');
                  }}>
                  <Text style={[styles.text, isVideoMode && styles.textSelected]}>Vídeo</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.lastImage}
                  onPress={() => {
                    navigation.navigate('Galery');
                  }}>
                  {lastPhotoUri ? (
                    <Image source={{ uri: lastPhotoUri }} style={styles.lastImage} />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={isRecording ? styles.recordingButton : styles.takePhotoButton}
                  onPress={takePicture}>
                  {isRecording ? <View style={styles.squareButton} /> : null}
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleFacingButton} onPress={toggleCameraFacing}>
                  <Icon name="rotate-ccw" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {},
  camera: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
    flexDirection: 'row',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  takePhotoButton: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleFacingButton: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  lastImage: {
    width: 50,
    height: 50,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontWeight: '300',
  },
  textSelected: {
    fontWeight: '700',
  },
  changeModeContainer: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 20,
    justifyContent: 'center',
  },
  recordingButton: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareButton: {
    width: 25,
    height: 25,
    backgroundColor: 'red',
    position: 'absolute',
    borderRadius: 5,
  },
});

export default CameraScreen;
