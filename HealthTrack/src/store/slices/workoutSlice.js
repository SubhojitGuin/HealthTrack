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
    setFitnessData: (state, action) => {
      state.availableWorkouts = action.payload.workouts;
      state.nutritionPlans = action.payload.nutrition;
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

export const { setFitnessData, setUserWorkoutHistory, setUserPreference, logNewWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;