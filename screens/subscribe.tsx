import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import CommentSection from 'components/CommentSection';
import Header from 'components/Header';
import PostFeed from 'components/PostFeed';
import TabMenu from 'components/TabMenu';
import MenuModal from 'components/MenuModal';
import { NavigationContext } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
  BackHandler 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

interface Game {
  id: number;
  name: string;
  gameimageUrl: string;
}

interface Post {
  id: number;
  content: string;
  imageUrl: string;
  authorId: number;
  createdAt: string;
}

const Subscribe = ({ navigation }: Props) => {
  

  return (
    <View></View>
  );
    
};

const styles = StyleSheet.create({
  
});

export default Subscribe;
