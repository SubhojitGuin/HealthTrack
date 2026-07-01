import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DashboardScreen, { DASHBOARD_SCREEN } from '../screens/Dashboard/DashboardScreen';
import WorkoutScreen, { WORKOUT_SCREEN } from '../screens/Workouts/WorkoutScreen';
import ProfileScreen, { PROFILE_SCREEN } from '../screens/Profile/ProfileScreen';

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
export const TAB_NAVIGATOR = 'TabNavigator';