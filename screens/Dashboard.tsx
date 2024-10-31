import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from 'services/api';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Game {
  id: number;
  name: string;
  description: string;
  category: string;
  gameimageUrl: string | null;
}

const Dashboard = () => {
  const navigation = useNavigation();
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          await fetchUserGames(id);
        } else {
          console.error('Erro: userId não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao carregar userId do AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserId();
  }, []);

  const fetchUserGames = async (id: string) => {
    try {
      const response = await api.get(`/api/games/user/${id}`);
      setUserGames(response.data); // Diretamente mapeia a lista de jogos
    } catch (error) {
      console.error('Erro ao buscar jogos do usuário:', error);
    }
  };

  const handleGameregister = () => {
    navigation.navigate('GameRegister');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando jogos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#121212', paddingTop: 32 }}>
      {/* Cabeçalho com botão de voltar e título centralizado */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: 'absolute', left: 0 }}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Dashboard</Text>
      </View>

      {/* Linha com título "Seus jogos" e botão de adicionar (só aparece se houver jogos) */}
      {userGames.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Seus jogos</Text>
          <TouchableOpacity onPress={handleGameregister}>
            <Icon name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {userGames.length > 0 ? (
        <FlatList
          data={userGames}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                padding: 20,
                backgroundColor: '#1f1f1f',
                borderRadius: 8,
                marginBottom: 16,
              }}>
              <Image
                source={{ uri: item.gameimageUrl || 'https://via.placeholder.com/100' }}
                style={{ width: 100, height: 100, borderRadius: 8, marginRight: 16 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
                  {item.name}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 14, marginBottom: 6 }}>
                  {item.category}
                </Text>
                <Text
                  style={{ color: '#ddd', fontSize: 14 }}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item.description}
                </Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', marginBottom: 16 }}>
            Você ainda não adicionou nenhum jogo à plataforma
          </Text>
          <TouchableOpacity
            onPress={handleGameregister}
            style={{ padding: 10, backgroundColor: '#6a0dad', borderRadius: 8 }}>
            <Text style={{ color: '#fff' }}>Adicionar jogo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Dashboard;
