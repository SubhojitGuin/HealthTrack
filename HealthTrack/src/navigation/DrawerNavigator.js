import { View, Text, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { 
  createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItemList, 
  DrawerItem 
} from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { tokenManager } from '../utils/tokenManager';
import { storageService } from '../services/storageService';
import { ABOUT_SCREEN, LOGIN_SCREEN, SETTINGS_SCREEN, TAB_NAVIGATOR } from './routes';

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
      <Drawer.Screen name={TAB_NAVIGATOR} component={TabNavigator} options={{ title: "Home" }} />
      <Drawer.Screen name={SETTINGS_SCREEN} component={SettingsScreen} options={{ title: "Settings" }} />
      <Drawer.Screen name={ABOUT_SCREEN} component={AboutScreen} options={{ title: "About" }} />
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
