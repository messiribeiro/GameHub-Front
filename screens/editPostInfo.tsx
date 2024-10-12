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
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import GoBackAlert from '../components/GoBackAlert';
import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'EditPostInfo'>;

const EditPostInfo = ({ navigation, route }: Props) => {
  const { photoUri, cameraType } = route.params;
  const isFrontCamera = cameraType === 'front';

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // Duração total do vídeo em segundos
  const [currentTime, setCurrentTime] = useState(0); // Tempo atual de reprodução

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false} // Removendo barra de rolagem vertical
      >
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
            <View>
              <Video
                ref={videoRef}
                source={{ uri: photoUri }}
                style={imageStyle}
                shouldPlay={isPlaying}
                isLooping
                onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                  if (status.isLoaded) {
                    if (status.didJustFinish) {
                      setIsPlaying(false);
                    }
                    // Atualiza a duração total e o tempo atual
                    setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
                    setCurrentTime(status.positionMillis ? status.positionMillis / 1000 : 0);
                  }
                }}
                onTouchEnd={handleTogglePlay}
              />
              <View style={styles.videoInfo}>
                <Text style={styles.timeText}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
              </View>
            </View>
          ) : (
            <Image source={{ uri: photoUri }} style={imageStyle} resizeMode="cover" />
          )}
        </View>
        <View style={styles.subtitleInput}>
          <TextInput
            style={styles.input}
            placeholder={`Adicione uma legenda ao ${isVideo ? 'seu vídeo' : 'sua imagem'}`}
            placeholderTextColor="white"
            multiline // Permite múltiplas linhas
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Avançar</Text>
          <Icon name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>

        <GoBackAlert
          visible={isModalVisible}
          title={isVideo ? 'Descartar Vídeo?' : 'Descartar Imagem?'}
          message="As alterações serão perdidas"
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirmExit}
        />
      </ScrollView>
    </View>
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
    marginTop: 20,
    width: '100%',
    height: '45%',
    alignItems: 'center',
  },
  imagePreview: {
    width: 250,
    height: 400,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  invertedImagePreview: {
    height: 400,
    aspectRatio: 1,
    borderRadius: 10,
    transform: [{ scaleX: -1 }],
  },
  videoInfo: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    padding: 5,
    borderRadius: 5,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
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
