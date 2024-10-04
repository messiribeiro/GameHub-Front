import { StackScreenProps } from '@react-navigation/stack';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Album } from 'expo-media-library';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, StatusBar, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Camera'>;

const ChatWindow = ({ navigation }: Props) => {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();

  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [permissionResponse, requestMediaPermission] = MediaLibrary.usePermissions();
  const [lastPhotoUri, setLastPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    getAlbums();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
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
    if (facing == 'back') {
      setFacing('front');
    } else {
      setFacing('back');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.screenContainer}>
          <View style={styles.buttonContainer}>
            <View style={styles.lastImage}>
              {lastPhotoUri ? (
                <Image source={{ uri: lastPhotoUri }} style={styles.lastImage} />
              ) : (
                <View style={styles.placeholderImage} />
              )}
            </View>
            <TouchableOpacity style={styles.takePhotoButton} onPress={() => {}} />
            <TouchableOpacity style={styles.toggleFacingButton} onPress={toggleCameraFacing}>
              <Icon name="rotate-ccw" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
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

export default ChatWindow;
