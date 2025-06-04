// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logInProgress: false,
  user: null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setlogInProgress: (state, action) => {
      state.logInProgress = action.payload;
    },
  },
});

export const { setCredentials, logout, setlogInProgress } = authSlice.actions;

export default authSlice.reducer;
