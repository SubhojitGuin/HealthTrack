import { createSlice } from "@reduxjs/toolkit";
import { dark, light } from "../../styles/colors";
import { StyleSheet } from "react-native";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light", // Default to light mode
    colors: StyleSheet.create(light), // Default to light theme colors
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"; // Toggle between light and dark mode
      state.colors = StyleSheet.create(state.mode === "light" ? light : dark); // Switch between light and dark colors
    },
    setTheme: (state, action) => {
      state.mode = action.payload.mode;
      state.colors = StyleSheet.create(action.payload.mode === "light" ? light : dark);
    }
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;