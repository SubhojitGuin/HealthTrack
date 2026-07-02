import { Platform } from "react-native";

export const API_BASE_URL = (Platform.OS === "web") ? "http://localhost:4000" : "https://c440-2405-201-8006-7818-5440-1dbc-92a6-8ea7.ngrok-free.app"; // Placeholder for the actual API base URL

// AsyncStorage Keys
export const AUTH_STORAGE_KEY = "authToken";
export const USER_STORAGE_KEY = "userData";
