import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "android"
    ? "https://292f-2405-201-8006-7818-d513-1b00-47ee-cf08.ngrok-free.app"
    : "http://localhost:4000";

// AsyncStorage Keys
export const AUTH_STORAGE_KEY = "authToken";
export const USER_STORAGE_KEY = "userData";
