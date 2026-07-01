import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
    isLoading: true,
    profilePhoto: null,  // Managed by imagePickerService
    progressPhotos: [],  // Managed by cameraService
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.profilePhoto = action.payload.user.profilePhoto;
      state.progressPhotos = action.payload.user.progressPhotos || [];
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.profilePhoto = null;
      state.progressPhotos = [];
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    autoLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.profilePhoto = action.payload.user.profilePhoto;
      state.progressPhotos = action.payload.user.progressPhotos || [];
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateProfilePhoto: (state, action) => {
      state.profilePhoto = action.payload;
      if (state.user) state.user.profilePhoto = action.payload;
    },
    addProgressPhoto: (state, action) => {
      state.progressPhotos.push(action.payload);
      if (state.user) state.user.progressPhotos.push(action.payload);
    },
  },
});

export const { login, logout, autoLogin, setLoading, updateProfilePhoto, addProgressPhoto } = authSlice.actions;
export default authSlice.reducer;