import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { AUTH_STORAGE_KEY, USER_STORAGE_KEY } from "../../utils/constants";
import { tokenManager } from "../../utils/tokenManager";
import { LOGIN_SCREEN } from "./LoginScreen";
import { DRAWER_NAVIGATOR } from "../../navigation/DrawerNavigator";
import { autoLogin } from "../../store/slices/authSlice";
import { storageService } from "../../services/storageService";

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const checkLogin = async () => {
    try {
      const token = await tokenManager.getToken();
      if (token) {
        const user = await storageService.getItem(USER_STORAGE_KEY);
        dispatch(autoLogin({ token, user }));
        navigation.replace(DRAWER_NAVIGATOR);
      } else {
        navigation.replace(LOGIN_SCREEN);
      }
    } catch (error) {
      console.log(error);
      navigation.replace(LOGIN_SCREEN);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});

export const SPLASH_SCREEN = "SplashScreen";

export default SplashScreen;