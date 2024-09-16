import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';

import { RootStackParamList } from '../navigation';

// Defining the type of props
type Props = StackScreenProps<RootStackParamList, 'MyProfile'>;

const MyProfile = ({ route, navigation }: Props) => {
  const { selectedGames } = route.params;

  const games = [
    { id: '1', name: 'Fortnite', icon: require('../assets/gameIcons/fortnite.png') },
    { id: '2', name: 'GTAV', icon: require('../assets/gameIcons/gtaV.png') },
    { id: '3', name: 'Counter-Strike 2', icon: require('../assets/gameIcons/cs2.png') },
    { id: '4', name: 'Valorant', icon: require('../assets/gameIcons/valorant.png') },
    { id: '5', name: 'Minecraft', icon: require('../assets/gameIcons/minecraft.png') },
    { id: '6', name: 'League of Legends', icon: require('../assets/gameIcons/lol.png') },
    // Add more games here
  ];

  // Filter the games to only show the ones the user selected
  const selectedGameDetails = games.filter((game) => selectedGames.includes(game.id));

  return (
    <View style={styles.container}>
      {/* Banner */}
      <Image
        source={require('../assets/banner.png')} // replace with your banner image path
        style={styles.banner}
      />

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profilePictureWrapper}>
          <View style={styles.profilePicturePlaceholder} />
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.username}>@user1</Text>
          <Text style={styles.bio}>Edite o perfil para colocar uma mensagem de status</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>32 seguindo</Text>
            <Text style={styles.stat}>5 seguidores</Text>
            <Text style={styles.stat}>45 Publicações</Text>
          </View>
        </View>
        <View style={styles.actions}>
          {/* Settings Button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}>
            <Image source={require('../assets/settings.png')} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Selected Games Grid */}
      <FlatList
        data={selectedGameDetails}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.gameIconContainer}>
            <Image source={item.icon} style={styles.gameIcon} />
          </View>
        )}
        style={styles.gameGrid}
      />

      {/* Footer with icons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text>🚫</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text>➕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text>📧</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 10, // Add more space from the top
  },
  banner: {
    width: '100%',
    height: 150, // Height of the banner
    resizeMode: 'cover', // This keeps the image aspect ratio
    marginBottom: 20, // Space between banner and form
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20, // Space between profile and games grid
    alignItems: 'center',
  },
  profilePictureWrapper: {
    position: 'absolute',
    top: -50,
    left: 20, // Space from the left edge
    width: 80,
    height: 80,
  },
  profilePicturePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#121212', // Border color matches the background
  },
  profileDetails: {
    flex: 1,
    marginLeft: 20,
    paddingTop: 30, // Space to push content below the profile picture
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
    top: -10, // Adjust this to be just below the banner
    right: 20, // Space from the right edge
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: 'transparent', // No background color
    padding: 5, // Adjust padding to fit the icon
  },
  settingsIcon: {
    width: 36, // Adjust size if needed
    height: 36, // Adjust size if needed
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
