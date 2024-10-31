import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from 'services/api'; // Certifique-se de ter esta importação

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const MenuModal: React.FC<MenuProps> = ({ visible, onClose, navigation }) => {
  const slideAnim = React.useRef(new Animated.Value(-screenWidth)).current;

  const [userStats, setUserStats] = useState<{
    followersCount: number;
    followingCount: number;
  } | null>(null);
  const [userData, setUserData] = useState<{ profilePictureUrl: string; username: string } | null>(
    null
  );

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
      fetchUserStats(); // Fetch user stats when modal is opened
      fetchUserData(); // Fetch user data when modal is opened
    } else {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const fetchUserStats = async () => {
    try {
      const profileUserId = await AsyncStorage.getItem('userId');
      const statsResponse = await api.get(`api/friendships/stats/${profileUserId}`);
      setUserStats(statsResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const profileUserId = await AsyncStorage.getItem('userId');
      const userResponse = await api.get(`api/users/${profileUserId}`);
      setUserData(userResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      navigation.navigate('Login');
      onClose();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MyProfile');
          }}>
          <Image
            source={{ uri: userData?.profilePictureUrl }}
            style={styles.userImage}
            onError={() => console.error('Erro ao carregar imagem do perfil')}
          />
        </TouchableOpacity>

        <View style={styles.userData}>
          <Text style={styles.username}>{userData?.username || '@Usuário'}</Text>
          <View style={styles.status}>
            <View style={styles.circle} />
            <Text style={styles.statusText}>online</Text>
          </View>
        </View>
      </View>

      <View style={styles.follows}>
        <Text style={styles.followers}>{userStats?.followingCount || 0} seguindo</Text>
        <Text style={styles.following}>{userStats?.followersCount || 0} seguidores</Text>
      </View>

      <View style={styles.premiumContainer}>
        <Text style={styles.title}>Seja um usuário premium</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Subscribe');
          }}
          style={styles.gameDev}>
          <Icon name="code" size={20} color="#fff" />
          <Text style={styles.text}>GameDev</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pagesAndLogoutContainer}>
        <View style={styles.settingsView}>
          <Icon name="settings" size={20} color="#fff" />
          <Text style={styles.text}>Configurações</Text>
        </View>
        <TouchableOpacity style={styles.logoutView} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#fff" />
          <Text style={styles.text}>Sair</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: screenHeight + 1000,
    width: '80%',
    backgroundColor: '#141414',
    padding: 20,
    paddingTop: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: 10,
  },
  followers: {
    color: 'white',
    fontSize: 15,
  },
  following: {
    color: 'white',
    fontSize: 15,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  userData: {},
  username: {
    color: 'white',
    fontSize: 15,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  circle: {
    width: 10,
    height: 10,
    backgroundColor: '#36C929',
    borderRadius: 50,
    top: 1,
  },
  follows: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-between',
  },
  premiumContainer: {
    marginTop: 30,
    gap: 10,
  },
  text: {
    color: 'white',
    fontSize: 15,
  },
  statusText: {
    color: 'white',
  },
  gameDev: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  pagesAndLogoutContainer: {
    marginTop: '30%',
    gap: 15,
  },
  settingsView: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  logoutView: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
});

export default MenuModal;
