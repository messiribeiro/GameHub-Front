import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Video, AVPlaybackStatus } from 'expo-av'; // Importa o Video e o tipo AVPlaybackStatus
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

import GoBackAlert from '../components/GoBackAlert';
import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'EditPostInfo'>;

const EditPostInfo = ({ navigation, route }: Props) => {
  const { photoUri, cameraType } = route.params;
  const isFrontCamera = cameraType === 'front';

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const isVideo = photoUri && photoUri.endsWith('.mp4');

  const imageStyle = isFrontCamera ? styles.invertedImagePreview : styles.imagePreview;

  const [isModalVisible, setModalVisible] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!unsubscribeRef.current) {
        unsubscribeRef.current = navigation.addListener('beforeRemove', (e) => {
          e.preventDefault();
          setModalVisible(true);
        });
      }

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    }, [navigation])
  );

  const handleConfirmExit = () => {
    setModalVisible(false);

    setTimeout(() => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Camera' }],
      });
    }, 100);
  };

  const handleTogglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={isFrontCamera ? 0 : 100}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon style={styles.arrowLeft} name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isVideo ? 'Verifique seu Vídeo' : 'Verifique sua Imagem'}
          </Text>
        </View>
        <View style={styles.imageContainer}>
          {isVideo ? (
            <Video
              ref={videoRef}
              source={{ uri: photoUri }}
              style={imageStyle}
              shouldPlay={isPlaying} // Controla a reprodução através do estado
              isLooping
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if (status.isLoaded && status.didJustFinish) {
                  setIsPlaying(false); // Reseta o estado de reprodução quando o vídeo termina
                }
              }}
              onTouchEnd={handleTogglePlay} // Alterna a reprodução ao tocar no vídeo
            />
          ) : (
            <Image source={{ uri: photoUri }} style={imageStyle} resizeMode="cover" />
          )}
        </View>
        <View style={styles.subtitleInput}>
          <TextInput
            style={styles.input}
            placeholder={`Adicione uma legenda à sua ${isVideo ? 'vídeo' : 'imagem'}`}
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
