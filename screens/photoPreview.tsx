import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'PhotoPreview'>;

const PhotoPreview = ({ route }: Props) => {
  const { photoUri } = route.params;
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, width: 100, height: 100 }); // Tamanho padrão para o crop
  const [isCropping, setIsCropping] = useState(false);
  const animatedValue = useRef(new Animated.ValueXY()).current;

  // Inicializando o panResponderRef com PanResponder.create()
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsCropping(true);
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const newX = cropRect.x + gestureState.dx;
        const newY = cropRect.y + gestureState.dy;
        setCropRect({ ...cropRect, x: newX, y: newY });
        animatedValue.setValue({ x: newX, y: newY });
      },
      onPanResponderRelease: () => {
        setIsCropping(false);
        // Você pode querer fazer algo mais ao soltar o gesto
      },
    })
  ).current; // Aqui estamos chamando .current diretamente

  console.log('Received Photo URI:', photoUri); // Log do URI recebido

  if (!photoUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No photo available</Text>
      </View>
    );
  }

  const handleImageLoad = (event: any) => {
    setImageWidth(event.nativeEvent.width);
    setImageHeight(event.nativeEvent.height);
  };

  const renderCropGrid = () => {
    if (isCropping) {
      return (
        <View style={styles.cropGridContainer}>
          <View
            style={[
              styles.cropGrid,
              { top: cropRect.y, left: cropRect.x, width: cropRect.width, height: cropRect.height },
            ]}
          />
        </View>
      );
    }
    return null;
  };

  const renderCropButton = () => {
    return (
      <View style={styles.cropButtonContainer}>
        <Text style={styles.cropButtonText}>Crop</Text>
      </View>
    );
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Image
        source={{ uri: photoUri }}
        style={styles.image}
        onLoad={handleImageLoad}
        resizeMode="contain"
      />
      {renderCropGrid()}
      {renderCropButton()}
      {isCropping && (
        <Animated.View
          style={[
            styles.cropRect,
            {
              transform: [{ translateX: animatedValue.x }, { translateY: animatedValue.y }],
              top: cropRect.y,
              left: cropRect.x,
              width: cropRect.width,
              height: cropRect.height,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
  cropGridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cropGrid: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
  },
  cropButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  cropButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cropRect: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default PhotoPreview;
