import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import WorkoutScreen from '../screens/Workouts/WorkoutScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { DASHBOARD_SCREEN, PROFILE_SCREEN, WORKOUT_SCREEN } from './routes';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={DASHBOARD_SCREEN} component={DashboardScreen} />
      <Tab.Screen name={WORKOUT_SCREEN} component={WorkoutScreen} />
      <Tab.Screen name={PROFILE_SCREEN} component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigator