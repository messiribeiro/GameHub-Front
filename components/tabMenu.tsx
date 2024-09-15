import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
const TabMenu = () => {
  const handlePress = () => {
    Alert.alert('Botão pressionado!', 'Você pressionou o botão!');
  };

  return (
    <View style={styles.container}>
      <Icon name="compass" size={26} color="#000000" />
      <Icon name="plus-circle" size={26} color="#000000" />
      <Icon name="mail" size={26} color="#000000" />



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 50,
    backgroundColor: "#D4E5FF",
    borderRadius: 30,
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15


  }
});

export default TabMenu;
