import AsyncStorage from "@react-native-async-storage/async-storage";
import { PREFERENCES_STORAGE_KEY, USER_STORAGE_KEY } from "../utils/constants";

const getValue = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export const storageService = {
  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? getValue(value) : null;
    } catch (error) {
      console.error("Error occurred while fetching item from storage:", error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error occurred while saving item to storage:", error);
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error occurred while removing item from storage:", error);
    }
  },
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error occurred while clearing storage:", error);
    }
  },
  saveUserData: async (user) => {
    try {
      await storageService.setItem(USER_STORAGE_KEY, user);
    } catch (error) {
      console.error("Error occurred while saving user to storage:", error);
    }
  },
  getUserData: async () => {
    try {
      return await storageService.getItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Error occurred while fetching user from storage:", error);
      return null;
    }
  },
  saveUserPreferences: async (preferences) => {
    try {
      await storageService.setItem(PREFERENCES_STORAGE_KEY, preferences);
    } catch (error) {
      console.error("Error occurred while saving preferences to storage:", error);
    }
  },
  getUserPreferences: async () => {
    try {
      return await storageService.getItem(PREFERENCES_STORAGE_KEY);
    } catch (error) {
      console.error("Error occurred while fetching preferences from storage:", error);
      return null;
    }
  },
}