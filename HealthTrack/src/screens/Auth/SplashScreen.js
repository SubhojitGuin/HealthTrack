import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { AUTH_STORAGE_KEY, PREFERENCES_STORAGE_KEY, USER_STORAGE_KEY } from "../../utils/constants";
import { tokenManager } from "../../utils/tokenManager";
import { login } from "../../store/slices/authSlice";
import { storageService } from "../../services/storageService";
import { DRAWER_NAVIGATOR, LOGIN_SCREEN } from "../../navigation/routes";
import { setUserPreferences } from "../../store/slices/workoutSlice";
import { setTheme } from "../../store/slices/themeSlice";

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const checkLogin = async () => {
    try {
      const token = await tokenManager.getToken();

      if (token) {
        const user = await storageService.getItem(USER_STORAGE_KEY);
        const preferences = await storageService.getItem(PREFERENCES_STORAGE_KEY);

        console.log("User data from storage:", user);
        console.log("User preferences from storage:", preferences);

        dispatch(login({ token, user }));
        dispatch(setUserPreferences({ preferences }));
        dispatch(setTheme({ mode: preferences.theme }));

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

export default SplashScreen;