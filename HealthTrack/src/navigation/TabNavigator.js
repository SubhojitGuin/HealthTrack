import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import WorkoutScreen from '../screens/Workouts/WorkoutScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { DASHBOARD_SCREEN, NUTRIENTS_SCREEN, OUTDOOR_RUN_SCREEN, PROFILE_SCREEN, WORKOUT_SCREEN } from './routes';
import NutrientsScreen from '../screens/Nutrients/NutrientsScreen';
import OutdoorRunScreen from '../screens/OutdoorRun/OutdoorRunScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName={DASHBOARD_SCREEN}>
      <Tab.Screen name={DASHBOARD_SCREEN} component={DashboardScreen} options={{ title: "Dashboard" }} />
      <Tab.Screen name={WORKOUT_SCREEN} component={WorkoutScreen} options={{ title: "Workouts" }} />
      <Tab.Screen name={NUTRIENTS_SCREEN} component={NutrientsScreen} options={{ title: "Nutrients" }} />
      <Tab.Screen name={OUTDOOR_RUN_SCREEN} component={OutdoorRunScreen} options={{ title: "Outdoor Run" }} />
      <Tab.Screen name={PROFILE_SCREEN} component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  )
}

export default TabNavigator