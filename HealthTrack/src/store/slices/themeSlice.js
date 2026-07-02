import { createSlice } from "@reduxjs/toolkit";
import { dark, light } from "../../styles/colors";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light", // Default to light mode
    colors: light, // Default to light theme colors
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"; // Toggle between light and dark mode
      state.colors = state.mode === "light" ? light : dark; // Switch between light and dark colors
    },
    setTheme: (state, action) => {
      state.mode = action.payload.mode;
      state.colors = action.payload.mode === "light" ? light : dark;
    }
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;