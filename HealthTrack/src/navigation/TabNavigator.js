import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import WorkoutScreen from '../screens/Workouts/WorkoutScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { DASHBOARD_SCREEN, NUTRIENTS_SCREEN, OUTDOOR_RUN_SCREEN, PROFILE_SCREEN, WORKOUT_SCREEN } from './routes';
import NutrientsScreen from '../screens/Nutrients/NutrientsScreen';
import OutdoorRunScreen from '../screens/OutdoorRun/OutdoorRunScreen';
import { useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const colors = useSelector((state) => state.theme.colors);

  return (
    <Tab.Navigator 
      initialRouteName={DASHBOARD_SCREEN}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 2,
          shadowOpacity: 0.1,
        },
        headerTintColor: colors.text,

        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
        },
        
        tabBarTranslucent: false, 
        
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        }
      }}
    >
      <Tab.Screen
        name={DASHBOARD_SCREEN} 
        component={DashboardScreen} 
        options={{ 
          title: "Dashboard",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name={WORKOUT_SCREEN} 
        component={WorkoutScreen} 
        options={{ 
          title: "Workouts",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'fitness' : 'fitness-outline'} size={size} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name={NUTRIENTS_SCREEN} 
        component={NutrientsScreen} 
        options={{ 
          title: "Nutrients" ,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'nutrition' : 'nutrition-outline'} size={size} color={color} />
          )
        }} 
        />
      <Tab.Screen 
        name={OUTDOOR_RUN_SCREEN} 
        component={OutdoorRunScreen} 
        options={{ 
          title: "Outdoor Run",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'walk' : 'walk-outline'} size={size} color={color} />
          )
        }} />
      <Tab.Screen 
        name={PROFILE_SCREEN} 
        component={ProfileScreen} 
        options={{ 
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color={color} />
          )
        }} />
    </Tab.Navigator>
  )
}

export default TabNavigator
