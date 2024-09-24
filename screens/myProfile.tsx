import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import axios from 'axios';
import { RootStackParamList } from '../navigation';
import TabMenu from 'components/TabMenu';

// Defining the type of props
type Props = StackScreenProps<RootStackParamList, 'MyProfile'>;

const MyProfile = ({ navigation }: Props) => {
  const [userData, setUserData] = useState<any>(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      try {
        const response = await axios.get(`https://gamehub-back-6h0k.onrender.com/api/users/${userId}`);
        console.log('User profile response:', response.data);
        setUserData(response.data);

        // Extracting game IDs from the GameUser relationship
        const gameIds = response.data.GameUser.map((gameUser: any) => gameUser.gameId);
        setSelectedGameDetails(gameIds);
      } catch (error) {
        console.error('Failed to load profile data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // If loading, show a loading message
  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  // If userData is not available, handle it
  if (!userData) {
    return <Text style={styles.errorText}>Failed to load profile data.</Text>;
  }

  const games = [
    {
      id: '1',
      name: 'Apex Legends',
      icon: { uri: 'https://www.malwarebytes.com/wp-content/uploads/sites/2/2024/03/Apex_legends_logo.png?w=1200' },
    },
    {
      id: '2',
      name: 'World of Warcraft',
      icon: { uri: 'https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2024/04/wovr.jpg' },
    },
    {
      id: '3',
      name: 'Age of Empires',
      icon: { uri: 'https://www.ageofempires.com/wp-content/uploads/2021/10/ogthumb.jpg' },
    },
    {
      id: '4',
      name: 'League of Legends',
      icon: { uri: 'https://static.wikia.nocookie.net/leagueoflegends/images/7/76/LoL_Icon.png/revision/latest?cb=20170427054945' },
    },
  ];

  // Filter the games to show only the ones the user selected
  // Inside the MyProfile component

  // After fetching userData
  const filteredGameDetails = games.filter((game) =>
    userData.GameUser.some((gameUser: any) => gameUser.gameId === Number(game.id))
  );

  return (
      <>
    <View style={styles.container}>
      {/* Banner */}
      <Image source={require('../assets/banner.png')} style={styles.banner} />

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profilePictureWrapper}>
          <Image
            style={styles.userImage}
            source={{ uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg' }}
          />
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.username}>@{userData.username}</Text>
          <Text style={styles.bio}>Edite o perfil para colocar uma mensagem de status</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>{userData.GameUser.length} jogos</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
            <Image source={require('../assets/settings.png')} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Selected Games Grid */}
      <FlatList
        data={filteredGameDetails}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.gameIconContainer}>
            <Image source={item.icon} style={styles.gameIcon} />
          </View>
        )}
        style={styles.gameGrid}
      />


    </View>
    <TabMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 10,
  },
  userImage: {
      width: '100%',
      height: '100%',
      borderRadius: 40,
      borderWidth: 4,
      borderColor: '#121212'
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#f00',
    textAlign: 'center',
    marginTop: 20,
  },
  banner: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  profilePictureWrapper: {
    position: 'absolute',
    top: -50,
    left: 20,
    width: 80,
    height: 80,
  },
  profilePicturePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#121212',
  },
  profileDetails: {
    flex: 1,
    marginLeft: 20,
    paddingTop: 30,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    color: '#aaa',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  stat: {
    color: '#aaa',
    marginRight: 15,
  },
  actions: {
    flexDirection: 'row',
    position: 'absolute',
    top: -10,
    right: 20,
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: 'transparent',
    padding: 5,
  },
  settingsIcon: {
    width: 36,
    height: 36,
  },
  gameGrid: {
    padding: 10,
  },
  gameIconContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c1c',
    padding: 10,
    borderRadius: 5,
  },
  gameIcon: {
    width: 60,
    height: 60,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1c1c1c',
  },
  footerButton: {
    padding: 10,
  },
});

export default MyProfile;
