import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import SectionHeader from "../../components/SectionHeader";

import { signupUser } from "../../api/fitnessService";
import { login } from "../../store/slices/authSlice";
import { storageService } from "../../services/storageService";
import { tokenManager } from "../../utils/tokenManager";
import { DRAWER_NAVIGATOR, LOGIN_SCREEN } from "../../navigation/routes";

const SignupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

const ErrorText = ({ children }) => (
  <Text style={{ color: "red", marginBottom: 10 }}>{children}</Text>
);

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleSignup = async (values) => {
    try {
      const user = await signupUser(values);

      dispatch(login({ user, token: user.token }));
      tokenManager.setToken(user.token);
      storageService.saveUserData(user);

      navigation.reset({
        index: 0,
        routes: [{ name: DRAWER_NAVIGATOR }],
      });
    } catch (error) {
      console.log("Signup failed:", error);
      Alert.alert("Signup Failed", "Try again with valid details");
    }
  };

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={handleSignup}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        errors,
        touched,
      }) => (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.sectionContainer}>
            <SectionHeader text="Signup" />
          </View>

          <View>
            <Input
              placeholder="Name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
            />
            {touched.name && errors.name && (
              <ErrorText>{errors.name}</ErrorText>
            )}

            <Input
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {touched.email && errors.email && (
              <ErrorText>{errors.email}</ErrorText>
            )}

            <Input
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {touched.password && errors.password && (
              <ErrorText>{errors.password}</ErrorText>
            )}
          </View>

          <Button title="Signup" onPress={handleSubmit} />

          <Button
            title="Go to Login"
            onPress={() => navigation.navigate(LOGIN_SCREEN)}
          />
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
});
