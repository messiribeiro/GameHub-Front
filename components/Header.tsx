import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, Dimensions} from 'react-native';

const Header = () => {
  return (
  <View style={styles.header}>
          <Image style={styles.userImage} source={{ uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg' }} />
          <Text style={styles.title}>GameHub</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: "2%",
    paddingRight: "2%",
    alignItems: "center",
    justifyContent: "space-between"
    
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "800",
    
  },
});

export default Header;