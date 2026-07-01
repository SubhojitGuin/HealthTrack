import { createSlice } from "@reduxjs/toolkit";
import { dark, light } from "../../styles/colors";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: true, // true for light mode, false for dark mode
    colors: light, // Default to light theme colors
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = !state.mode;
      state.colors = state.mode ? light : dark; // Switch between light and dark colors
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;