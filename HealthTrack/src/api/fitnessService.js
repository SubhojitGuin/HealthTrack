import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { tokenManager } from "../utils/tokenManager";

export const fitnessApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

fitnessApi.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const loginUser = async (email, password) => {
  const response = await fitnessApi.get("/users", {
    params: { email },
  });

  const user = response.data.find((u) => u.password === password);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  return user;
};

export const signupUser = async (userData) => {
  try {
    const response = await fitnessApi.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const fetchWorkoutHistory = async (userId) => {
  try {
    const response = await fitnessApi.get(`/workoutHistory`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error("Error fetching workout history:", error);
    throw error;
  }
};

export const fetchAvailableWorkouts = async () => {
  try {
    const response = await fitnessApi.get("/workouts");
    return response.data;
  } catch (error) {
    console.error("Error fetching available workouts:", error);
    throw error;
  }
};

export const fetchUserPreference = async (userId) => {
  try {
    const response = await fitnessApi.get(`/preferences`, { params: { userId } });
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error("Error fetching user preference:", error);
    throw error;
  }
  return user;
};

export const signupUser = async (userData) => {
  try {
    const response = await fitnessApi.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};
