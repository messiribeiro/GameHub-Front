import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  navigation: StackNavigationProp<any>;
};

const Header: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
        <Image
          style={styles.userImage}
          source={{
            uri: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
          }}
        />
      </TouchableOpacity>
      <Text style={styles.title}>GameHub</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '5%',
    paddingRight: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: '800',
  },
});

export default Header;
