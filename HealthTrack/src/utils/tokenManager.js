import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_STORAGE_KEY } from './constants';
import { storageService } from '../services/storageService';

export const tokenManager = {
  getToken: async () => {
    try {
      const token = await storageService.getItem(AUTH_STORAGE_KEY);
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  setToken: async (token) => {
    try {
      await storageService.setItem(AUTH_STORAGE_KEY, token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  clearToken: async () => {
    try {
      await storageService.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  },
};