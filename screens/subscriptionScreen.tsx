import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather'; // Install this if you haven't
import { RootStackParamList } from '../navigation';
import { StackScreenProps } from '@react-navigation/stack';

// Define the types for PlanCard props
interface PlanCardProps {
  title: string;
  price: string;
  description: string[];
  popular?: boolean;
}
type Props = StackScreenProps<RootStackParamList, 'Subscription'>;

const SubscriptionScreen = ({ navigation }: Props) => {
  const PlanCard: React.FC<PlanCardProps> = ({ title, price, description, popular }) => (
    <View style={styles.planCard}>
      {popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Mais popular</Text>
        </View>
      )}
      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      {description.map((item, index) => (
        <Text key={index} style={styles.planDescription}>
          - {item}
        </Text>
      ))}
      <TouchableOpacity style={styles.subscribeButton}>
        <LinearGradient colors={['#7D3EDF', '#7D3EDF']} style={styles.gradientButton}>
          <Text style={styles.subscribeButtonText}>Assinar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Impulsione Seu Jogo!</Text>
      <Text style={styles.subtitle}>
        Com o plano GameDev, você pode adicionar e promover seu jogo na nossa plataforma,
        conectando-o com jogadores em busca de novas experiências. Alcance mais gamers e dê mais
        visibilidade ao seu projeto agora mesmo!
      </Text>

      {/* GameDev mensal Plan */}
      <PlanCard
        title="GameDev mensal"
        price="R$ 19,90/mês"
        description={[
          'Impulsione seus jogos',
          'Inclua até 10 jogos em nossa plataforma (Adicional de R$ 9,90 por jogo)',
          'Selo de GameDev no perfil',
          'Isenção de taxas',
        ]}
        popular={true}
      />

      {/* GameDev Basic mensal Plan */}
      <PlanCard
        title="GameDev Basic mensal"
        price="R$ 5,90/mês"
        description={[
          'Impulsione seus jogos',
          'Inclua até 2 jogos na nossa plataforma (Adicional de R$ 9,90 por jogo)',
          'Selo de GameDev no perfil',
        ]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1D1D',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderColor: '#444',
    borderWidth: 1,
  },
  popularBadge: {
    backgroundColor: '#7D3EDF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  popularText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  planTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    color: '#39FF14',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planDescription: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  subscribeButton: {
    marginTop: 20,
  },
  gradientButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SubscriptionScreen;
