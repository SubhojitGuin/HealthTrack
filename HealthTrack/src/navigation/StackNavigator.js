import React from 'react'
import LoginScreen, { LOGIN_SCREEN } from '../screens/Auth/LoginScreen';
import SignupScreen, { SIGNUP_SCREEN } from '../screens/Auth/SignupScreen';
import DrawerNavigator, { DRAWER_NAVIGATOR } from './DrawerNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen, { SPLASH_SCREEN } from '../screens/Auth/SplashScreen';

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

export const STACK_NAVIGATOR = 'StackNavigator';