import 'react-native-gesture-handler';

import RootStack from './navigation';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51QD4evICxiZsBAXRfhZhiSLdpcHqby4tkqgynnxCxwzD7pfls8lyryVhJ6JiaP9Q2YkHfwm9sFCAv30c78KVjCU3005bCNvxmv">
      <RootStack />
    </StripeProvider>
  );
}