import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text
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
  age: Yup.number()
    .min(1, "Age must be at least 1")
    .required("Age is required"),
  weight: Yup.number()
    .min(1, "Weight must be at least 1")
    .required("Weight is required"),
  height: Yup.number()
    .min(1, "Height must be at least 1")
    .required("Height is required"),
  password: Yup.string()
    .min(2, "Min 2 characters")
    .required("Password is required"),
});

const ErrorText = ({ children }) => (
  <Text style={{ color: "red", marginBottom: 10 }}>{children}</Text>
);

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleSignup = async (values) => {
    try {
      const user = await signupUser({ ...values, age: Number(values.age), weight: Number(values.weight), height: Number(values.weight) , token: "mock_jwt_token_user_001", role: "user", profilePhoto: "", progressPhotos: [] });

      dispatch(login({ user: user, token: user.token }));
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
      initialValues={{ name: "", email: "", password: "", age: 0, weight: 0, height: 0 }}
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
              label="Name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
            />
            <ErrorMessage name="name" component={ErrorText} />

            <Input
              placeholder="Email"
              label="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            <ErrorMessage name="email" component={ErrorText} />

            <View style={styles.numericInputsContainer}>
              <View>
                <Input
                  placeholder="Age"
                  label="Age"
                  value={values.age.toString()}
                  onChangeText={handleChange("age")}
                  onBlur={handleBlur("age")}
                  keyboardType="numeric"
                />
                <ErrorMessage name="age" component={ErrorText} />
              </View>

              <View>
                <Input
                  placeholder="Weight"
                  label="Weight"
                  value={values.weight.toString()}
                  onChangeText={handleChange("weight")}
                  onBlur={handleBlur("weight")}
                  keyboardType="numeric"
                />
                <ErrorMessage name="weight" component={ErrorText} />
              </View>

              <View>
                <Input
                  placeholder="Height"
                  label="Height"
                  value={values.height.toString()}
                  onChangeText={handleChange("height")}
                  onBlur={handleBlur("height")}
                  keyboardType="numeric"
                />
                <ErrorMessage name="height" component={ErrorText} />
              </View>
              </View>
              <Input
                placeholder="Password"
                label="Password"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              <ErrorMessage name="password" component={ErrorText} />
          </View>

          <Button title="Signup" onPress={handleSubmit} />

          <Button
            title="Go to Login"
            onPress={() => navigation.replace(LOGIN_SCREEN)}
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
  numericInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
