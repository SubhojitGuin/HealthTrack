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

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  // Access global colors palette from state
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

        // UPDATED TAB BAR STYLE
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
        },
        
        // ADD THIS LINE: Stops screen content from sliding underneath the bar
        tabBarTranslucent: false, 
        
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4, // Clean alignment spacing
        }
      }}
    >
      <Tab.Screen name={DASHBOARD_SCREEN} component={DashboardScreen} options={{ title: "Dashboard" }} />
      <Tab.Screen name={WORKOUT_SCREEN} component={WorkoutScreen} options={{ title: "Workouts" }} />
      <Tab.Screen name={NUTRIENTS_SCREEN} component={NutrientsScreen} options={{ title: "Nutrients" }} />
      <Tab.Screen name={OUTDOOR_RUN_SCREEN} component={OutdoorRunScreen} options={{ title: "Outdoor Run" }} />
      <Tab.Screen name={PROFILE_SCREEN} component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  )
}

export default TabNavigator
