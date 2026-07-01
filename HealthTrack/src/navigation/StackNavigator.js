import React from 'react'
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import DrawerNavigator from './DrawerNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Auth/SplashScreen';
import { DRAWER_NAVIGATOR, LOGIN_SCREEN, SIGNUP_SCREEN, SPLASH_SCREEN } from './routes';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={SPLASH_SCREEN}>
      <Stack.Screen name={SPLASH_SCREEN} component={SplashScreen} />
      <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
      <Stack.Screen name={SIGNUP_SCREEN} component={SignupScreen} />
      <Stack.Screen name={DRAWER_NAVIGATOR} component={DrawerNavigator} />
    </Stack.Navigator>
  )
}
