import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC<Props> = ({ navigation }) => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});

export default Dashboard;
