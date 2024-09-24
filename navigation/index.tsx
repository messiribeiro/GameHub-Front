/* eslint-disable prettier/prettier */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FindGamer from 'screens/findGamer';
import GameSelect from 'screens/gameSelect';
import Home from 'screens/home';
import MyProfile from 'screens/myProfile';
import Profile from 'screens/profile';
import Login from '../screens/login';
import SignupStep1 from '../screens/signupStep1';
import SignupStep2 from '../screens/signupStep2';
import SignupStep3 from '../screens/signupStep3';

// Definindo o tipo de parâmetros das rotas
export type RootStackParamList = {
  TabNavigator: undefined;
  Modal: undefined;
  Login: undefined;
  SignupStep1: undefined;
  SignupStep2: undefined;
  SignupStep3: undefined;
  GameSelect: undefined;
  Profile: { selectedGames: string[] };
  Settings: undefined;
  MyProfile: { selectedGames: string[] };
  Home: undefined;
  FindGamer: undefined;



};

const Tab = createBottomTabNavigator();


// Criando o Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupStep1"
          component={SignupStep1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupStep2"
          component={SignupStep2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupStep3"
          component={SignupStep3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameSelect"
          component={GameSelect}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}

          options={{ headerShown: false, gestureEnabled: false,}}
        />
        <Stack.Screen
          name="FindGamer"
          component={FindGamer}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
