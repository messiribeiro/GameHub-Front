import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import ImagePreview from 'components/ImagePreview';
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

    // Buscar a última foto da galeria
    const assets = await MediaLibrary.getAssetsAsync({
      first: 1, // Buscar apenas a última foto
      sortBy: MediaLibrary.SortBy.creationTime,
      mediaType: MediaLibrary.MediaType.photo,
    });

    if (assets.assets.length > 0) {
      setLastPhotoUri(assets.assets[0].uri); // Armazena o URI da última foto
    }
  }

  function toggleCameraFacing() {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
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

  const handleBack = () => {
    setPhoto(null);
  };

  function handleForward() {
    navigation.navigate('EditPostInfo', {
      photoUri: photo ? photo : 'erro',
      cameraType: facing,
    });
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <ImagePreview
          imageUri={photo}
          onBack={handleBack}
          onForward={handleForward}
          cameraFacing={facing}
        />
      ) : (
        <>
          <StatusBar hidden />
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.screenContainer}>
              <View style={styles.buttonContainer}>
                <View style={styles.lastImage}>
                  {lastPhotoUri ? (
                    <Image source={{ uri: lastPhotoUri }} style={styles.lastImage} />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                </View>
                <TouchableOpacity style={styles.takePhotoButton} onPress={takePicture} />
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
});

export default CameraScreen;
