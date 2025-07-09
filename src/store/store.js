// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

// Persist config for auth slice only
const authPersistConfig = {
  key: 'lockedByMe',
  storage,
  whitelist: ['token', 'user'], // which parts of state to persist
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    project: projectReducer,
  },
});

export const persistor = persistStore(store);
export default store;
