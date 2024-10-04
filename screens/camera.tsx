import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useMicrophonePermission,
} from 'react-native-vision-camera';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Camera'>;

const ChatWindow = ({ navigation }: Props) => {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } =
    useMicrophonePermission();
  const [permission, setPermission] = useState<null | boolean>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const status = await requestPermission();
      const statusMic = await requestMicPermission();

      if (status && statusMic) setPermission(true);
    })();
  }, []);

  if (!permission) return <View />;

  if (!device || device == null) return <View />;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Camera
        style={StyleSheet.absoluteFill}
        ref={cameraRef}
        device={device}
        isActive
        audio
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatWindow;
