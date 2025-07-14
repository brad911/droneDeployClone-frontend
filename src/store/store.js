// src/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
});

const persistConfig = {
  key: 'InfraXLockedKey',
  storage,
  whitelist: ['auth', 'project'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
