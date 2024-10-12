import { Video, AVPlaybackStatus } from 'expo-av';
import { CameraType } from 'expo-camera';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import GoBackAlert from './GoBackAlert';

interface VideoPreviewProps {
  VideoUri: string;
  onBack: () => void;
  onForward: () => void;
  cameraFacing: CameraType;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  VideoUri,
  onBack,
  onForward,
  cameraFacing,
}) => {
  const [isAlertVisible, setAlertVisible] = useState(false);

  const handleBackPress = () => {
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleConfirmBack = () => {
    setAlertVisible(false);
    onBack();
  };

  const VideoTransform = cameraFacing === 'front' ? [{ scaleX: -1 }] : [];

  return (
    <View style={styles.VideoPreviewContainer}>
      <Video
        source={{ uri: VideoUri }}
        style={[styles.VideoPreview, { transform: VideoTransform }]}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.forwardButton} onPress={onForward}>
          <Text style={styles.text}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <GoBackAlert
        visible={isAlertVisible}
        onClose={handleCloseAlert}
        onConfirm={handleConfirmBack}
        title="Descartar Videom?"
        message="você perderá a Videom criada"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 20,
  },
  VideoPreviewContainer: {
    flex: 1,
  },
  VideoPreview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  forwardButton: {
    width: 130,
    height: 50,
    backgroundColor: '#5312C2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
});

export default VideoPreview;
