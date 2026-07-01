import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView } from "react-native";
import React from 'react'
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import Input from '../../components/Input/index'
import { login } from '../../store/slices/authSlice';
import { loginUser } from '../../api/fitnessService';
import Button from '../../components/Button';
import { DRAWER_NAVIGATOR } from '../../navigation/DrawerNavigator';
import { SIGNUP_SCREEN } from './SignupScreen';
import { storageService } from "../../services/storageService";
import { tokenManager } from "../../utils/tokenManager";

const LoginSchema = Yup.object({
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

    loginUser(email, password).then(response => {
      const user = response;
      console.log("Login successful:", user);
      dispatch(login({ user: user, token: user.token }));
      tokenManager.setToken(user.token);
      storageService.saveUserData(user);
      navigation.reset({
        index: 0,
        routes: [{ name: DRAWER_NAVIGATOR }],
      });
    }).catch(error => {
      console.error("Login failed:", error);
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    })
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <KeyboardAvoidingView style={styles.loginContainer} behavior="padding">
          <Text>Login</Text>
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
          <Button title="Login" onPress={handleSubmit} />
          <Button title="Go to Signup" onPress={() => navigation.navigate(SIGNUP_SCREEN)} />
        </KeyboardAvoidingView>
      )}
    </Formik>
  )
}

export const LOGIN_SCREEN = 'LoginScreen';

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});