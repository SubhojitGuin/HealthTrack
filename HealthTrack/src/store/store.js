import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./slices/authSlice";
import ThemeReducer from "./slices/themeSlice";
import WorkoutReducer from "./slices/workoutSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    theme: ThemeReducer,
    workout: WorkoutReducer,
  },
});

export default store;