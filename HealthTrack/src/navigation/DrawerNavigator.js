import { View, Text, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { 
  createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItemList, 
  DrawerItem 
} from '@react-navigation/drawer';
import TabNavigator, { TAB_NAVIGATOR } from './TabNavigator';
import SettingsScreen, { SETTINGS_SCREEN } from '../screens/Settings/SettingsScreen';
import AboutScreen, { ABOUT_SCREEN } from '../screens/About/AboutScreen';
import { LOGIN_SCREEN } from '../screens/Auth/LoginScreen'; 
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { tokenManager } from '../utils/tokenManager';
import { storageService } from '../services/storageService';


const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {

  const dispatch = useDispatch();

  const handleLogout = async () => {
    console.log("Logout initiated");

    await tokenManager.clearToken();
    await storageService.clearAll();
    
    dispatch(logout());
    
    props.navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: LOGIN_SCREEN }],
    });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.mainItems}>
        <DrawerItemList {...props} />
      </View>
      
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        labelStyle={styles.logoutLabel}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name={TAB_NAVIGATOR} component={TabNavigator} />
      <Drawer.Screen name={SETTINGS_SCREEN} component={SettingsScreen} />
      <Drawer.Screen name={ABOUT_SCREEN} component={AboutScreen} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  mainItems: {
    flex: 1,
  },
  logoutLabel: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;
export const DRAWER_NAVIGATOR = 'DrawerNavigator';
