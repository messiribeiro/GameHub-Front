import 'react-native-gesture-handler';
import React from 'react';
import RootStack from './navigation';
import { StripeProvider } from '@stripe/stripe-react-native';

const linking = {
  prefixes: ['myapp://'], // Prefixo da sua URL personalizada
  config: {
    screens: {
      Home: 'screens/home',      // Rota para a tela inicial
      Success: 'screens/success', // Rota para a tela de sucesso
      Cancel: 'screens/cancel',   // Rota para a tela de cancelamento
    },
  },
};

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51QD4evICxiZsBAXRfhZhiSLdpcHqby4tkqgynnxCxwzD7pfls8lyryVhJ6JiaP9Q2YkHfwm9sFCAv30c78KVjCU3005bCNvxmv">
      <RootStack linking={linking} /> 
    </StripeProvider>
  );
}
