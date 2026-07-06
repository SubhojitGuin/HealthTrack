import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import React from 'react'
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import Input from '../../components/Input/index'
import { login } from '../../store/slices/authSlice';
import { fetchUserPreferences, loginUser } from '../../api/fitnessService';
import Button from '../../components/Button';
import { storageService } from "../../services/storageService";
import { tokenManager } from "../../utils/tokenManager";
import SectionHeader from "../../components/SectionHeader";
import { DRAWER_NAVIGATOR, SIGNUP_SCREEN } from "../../navigation/routes";
import { setUserPreferences } from "../../store/slices/workoutSlice";
import { setTheme } from "../../store/slices/themeSlice";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const ErrorText = ({ children }) => (
  <Text style={{ color: "red", marginBottom: 10 }}>{children}</Text>
);

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleLogin = (values) => {
    console.log("Login values:", values);
    const { email, password } = values;

    loginUser(email, password).then(async (response) => {
      const user = response;
      console.log("Login successful:", user);

      const preferences = await fetchUserPreferences(user.id);

      console.log("Fetched user preferences:", preferences);

      dispatch(login({ user: user, token: user.token }));
      dispatch(setUserPreferences({ preferences }));
      dispatch(setTheme({ mode: preferences.theme }));

      tokenManager.setToken(user.token);
      storageService.saveUserData(user);
      storageService.saveUserPreferences(preferences);

      navigation.reset({
        index: 0,
        routes: [{ name: DRAWER_NAVIGATOR }],
      });
    }).catch(error => {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    })
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ values, handleChange, handleBlur, handleSubmit }) => (
            <KeyboardAvoidingView style={styles.loginContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.sectionContainer}>
                <SectionHeader text="Login" />
              </View>
              <View>
                <Input
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <ErrorMessage name="email" component={ErrorText} />
                <Input
                  placeholder="Password"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                />
                <ErrorMessage name="password" component={ErrorText} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Login" onPress={handleSubmit} />
                <Button title="Go to Signup" onPress={() => navigation.replace(SIGNUP_SCREEN)} />
              </View>
            </KeyboardAvoidingView>
          )}
        </Formik>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});