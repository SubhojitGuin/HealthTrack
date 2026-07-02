import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  availableWorkouts: [], // Hydrated from fitnessService API call
  nutritionPlans: [],    // Hydrated from fitnessService API call
  history: [],           // Filters matching userId records
  userPreference: null,  // Target tracking goal context
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setWorkoutData: (state, action) => {
      state.availableWorkouts = action.payload.workouts;
    },
    setNutritionPlans: (state, action) => {
      state.nutritionPlans = action.payload.plans;
    },
    setUserWorkoutHistory: (state, action) => {
      state.history = action.payload.history;
    },
    setUserPreference: (state, action) => {
      state.userPreference = action.payload.preference;
    },
    logNewWorkout: (state, action) => {
      state.history.unshift(action.payload); // Prepends most recent completed session
    },
  },
});

export const { setWorkoutData, setNutritionPlans, setUserWorkoutHistory, setUserPreference, logNewWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;