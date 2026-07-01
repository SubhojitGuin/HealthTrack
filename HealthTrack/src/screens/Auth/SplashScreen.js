import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { autoLogin } from "../redux/slice/AuthSlice";
import { AUTH_STORAGE_KEY } from "../../utils/constants";

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const checkLogin = async () => {
    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (authData) {
        const { token, user } = JSON.parse(authData);
        dispatch(autoLogin({ token, user }));
        navigation.replace("Drawer");
      } else {
        navigation.replace("Login");
      }
    } catch (error) {
      console.log(error);
      navigation.replace("Login");
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