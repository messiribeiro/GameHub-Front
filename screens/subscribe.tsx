import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  
} from 'react-native';


import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Subscribe'>;

const Subscribe = ({ navigation }: Props) => {
  

  return (
    <View>
        <Text>hello world</Text>
    </View>
  );
    
};

const styles = StyleSheet.create({
  
});

export default Subscribe;
