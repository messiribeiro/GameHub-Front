import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import api from 'services/api'; // Importando a configuração da API

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Chat'>;

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  isRead: boolean; // Adiciona o campo isRead
  messageSender: {
    id: number;
    username: string;
    profilePictureUrl: string;
  };
  messageReceiver: {
    id: number;
    username: string;
    profilePictureUrl: string;
  };
}

const Chat = ({ navigation }: Props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('userId');
      console.log(id);
      setUserId(id);
    })();
  }, []);

  const fetchMessages = async () => {
    if (!userId) return;

    try {
      const response = await api.get(`/api/chat/user/${userId}`);
      const sortedMessages = response.data.sort((a: Message, b: Message) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      const readMessages = await AsyncStorage.getItem('readMessages');
      const readMessagesArray = readMessages ? JSON.parse(readMessages) : [];

      const updatedMessages = sortedMessages.map((message: Message) => ({
        ...message,
        isRead: readMessagesArray.includes(message.id),
      }));

      setMessages(updatedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const formatTime = (dateString: string) => {
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `há ${diffInSeconds} seg`;
    if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} h`;
    return `há ${Math.floor(diffInSeconds / 86400)} d`;
  };

  const handleChatPress = async (otherUserId: number, messageId: number) => {
    const readMessages = await AsyncStorage.getItem('readMessages');
    const readMessagesArray = readMessages ? JSON.parse(readMessages) : [];

    if (!readMessagesArray.includes(messageId)) {
      readMessagesArray.push(messageId);
      await AsyncStorage.setItem('readMessages', JSON.stringify(readMessagesArray));
    }

    navigation.navigate('ChatWindow', {
      receiverId: otherUserId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats</Text>
      </View>
      <ScrollView
        style={styles.chats}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {messages
          .filter((msg) => msg.receiverId !== msg.senderId)
          .map((message: Message) => {
            const otherUserId =
              message.senderId === Number(userId) ? message.receiverId : message.senderId;
            const user =
              message.senderId === Number(userId) ? message.messageReceiver : message.messageSender;

            return (
              <TouchableOpacity
                key={message.id}
                onPress={() => handleChatPress(otherUserId, message.id)}>
                <View style={styles.chat}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: user.profilePictureUrl }} style={styles.userImage} />
                  </View>
                  <View style={styles.info}>
                    <View style={styles.content}>
                      <Text style={styles.userName}>{user.username}</Text>
                      <Text
                        style={[
                          styles.messagePreview,
                          {
                            fontWeight:
                              message.senderId === Number(userId)
                                ? '400'
                                : message.isRead
                                  ? '400'
                                  : '800',
                          }, // Ajuste aqui
                        ]}>
                        {message.senderId === Number(userId)
                          ? `Você: ${message.content}`
                          : message.content}
                      </Text>
                    </View>
                    <View style={styles.time}>
                      <Text style={styles.timeText}>{formatTime(message.createdAt)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
