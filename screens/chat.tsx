import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Chat'>;

const Chat = ({ navigation }: Props) => {
  const handleChatPress = () => {
    navigation.navigate('ChatWindow', {
      receiverId: 1,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats</Text>
      </View>
      <ScrollView style={styles.chats} contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={handleChatPress}>
          <View style={styles.chat}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://lncimg.lance.com.br/uploads/2024/06/CORINTHIANS-1-1.jpg' }}
                style={styles.userImage}
              />
            </View>
            <View style={styles.info}>
              <View style={styles.content}>
                <Text style={styles.userName}>Joazin</Text>
                <Text style={styles.messagePreview}>Oi, quer jogar comigo?</Text>
              </View>

              <View style={styles.time}>
                <Text style={styles.timeText}>Agora</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Você pode adicionar mais chats aqui */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    width: '100%',
    height: '100%',
    color: 'white',
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    height: '7%',
    backgroundColor: '#2B2B2C',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
  chats: {
    padding: 20,
  },
  chat: {
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  userName: {
    color: 'white',
    fontWeight: '300',
  },
  messagePreview: {
    color: 'white',
    fontWeight: '800',
  },
  timeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
    opacity: 0.5,
  },
  imageContainer: {
    width: '15%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  content: {
    display: 'flex',
  },
  time: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  info: {
    width: '85%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default Chat;
