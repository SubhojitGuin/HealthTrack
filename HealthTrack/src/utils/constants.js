import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "web" ? "http://localhost:4000" : "https://b858-2405-201-8006-7818-e967-e250-5638-24e4.ngrok-free.app"; // Placeholder for the actual API base URL

// AsyncStorage Keys
export const AUTH_STORAGE_KEY = "authToken";
export const USER_STORAGE_KEY = "userData";
export const PREFERENCES_STORAGE_KEY = "userPreferences";
