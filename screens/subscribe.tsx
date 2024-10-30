import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Touchable } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

import { RootStackParamList } from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'Subscribe'>;

const Subscribe = ({ navigation }: Props) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Impulsione Seu Jogo!</Text>
          <Text style={styles.subtitle}>
            Com o plano GameDev, você pode adicionar e promover seu jogo na nossa plataforma,
            conectando-o com jogadores em busca de novas experiências. Alcance mais gamers e dê mais
            visibilidade ao seu projeto agora mesmo!
          </Text>
        </View>

        <Text style={styles.mostPopular}>Mais popular</Text>
        <View style={styles.plans}>
          <View style={styles.gamedevPlan}>
            <View style={styles.nameAndIcon}>
              <View style={styles.nameAndFrequency}>
                <Text style={styles.text}>GameDev</Text>
                <Text style={styles.p}>mensal</Text>
              </View>
              <Icon name="coffee" size={20} color="#fff" />
            </View>

            <Text style={styles.price}>R$ 19,90/mês</Text>
            <TouchableOpacity style={styles.buttonSubscribe}>
              <Text style={styles.buttonText}>Assinar</Text>
            </TouchableOpacity>

            <View style={styles.advantages}>
              <Text style={styles.advantagesText}>- Impulsione seus jogos</Text>
              <Text style={styles.advantagesText}>
                - Inclua até 10 jogos em nossa plataforma (Adicional de R$ 9,90 por jogo)
              </Text>
              <Text style={styles.advantagesText}>- Selo de GameDev no perfil</Text>
              <Text style={styles.advantagesText}>- Se livre dos anúncios</Text>
            </View>
          </View>

          <View style={styles.gamedevBasicPlan}>
            <View style={styles.nameAndIcon}>
              <View style={styles.nameAndFrequency}>
                <Text style={styles.text}>GameDev</Text>
                <Text style={styles.p}>mensal</Text>
              </View>
              <Icon name="coffee" size={20} color="#fff" />
            </View>

            <Text style={styles.price}>R$ 5,90/mês</Text>
            <TouchableOpacity style={styles.buttonSubscribe}>
              <Text style={styles.buttonText}>Assinar</Text>
            </TouchableOpacity>

            <View style={styles.advantages}>
              <Text style={styles.advantagesText}>- Impulsione seus jogos</Text>
              <Text style={styles.advantagesText}>
                - Inclua até 2 jogos em nossa plataforma (Adicional de R$ 9,90 por jogo)
              </Text>
              <Text style={styles.advantagesText}>- Selo de GameDev no perfil</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1E',
    padding: 30,
  },

  header: {
    alignItems: 'center',
    paddingTop: '10%',
  },
  title: {
    fontSize: 40,
    color: 'white',
    width: '70%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    marginTop: 25,
  },

  plans: {
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  mostPopular: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 30,
  },

  gamedevPlan: {
    backgroundColor: '#2B2B2C',
    height: 300,
    borderWidth: 1,
    borderColor: '#3A019E',
    borderRadius: 10,
    padding: 15,
  },

  gamedevBasicPlan: {
    backgroundColor: '#2B2B2C',
    height: 300,
    borderWidth: 1,
    borderColor: '#3A019E',
    borderRadius: 10,
    padding: 15,
    marginTop: 30,
  },
  p: {
    color: 'white',
    fontSize: 10,
    top: -3,
  },
  nameAndIcon: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  nameAndFrequency: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },

  price: {
    color: '#5FFF51',
    fontSize: 30,
    fontWeight: '600',
    marginTop: 5,
  },
  buttonSubscribe: {
    width: '100%',
    height: 40,
    borderRadius: 30,
    backgroundColor: '#701EFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },

  advantages: {
    gap: 5,
    marginTop: 10,
  },
  advantagesText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Subscribe;
