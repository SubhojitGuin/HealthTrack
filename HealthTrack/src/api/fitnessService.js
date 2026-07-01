import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { tokenManager } from "../utils/tokenManager";

const fitnessApi = axios.create({
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
  }
);

export const loginUser = async (email, password) => {
  try {
    const response = await fitnessApi.get("/users", { params: { email, password } });
    if (response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};