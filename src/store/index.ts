import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE, } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/store/slices/authSlice';
import userReducer from '@/store/slices/userSlice';
import appReducer from '@/store/slices/appSlice';
import spotifyReducer from '@/store/slices/spotifySlice'; // Persist configuration for app slice (sidebar state, theme, etc.)

// Persist configuration for app slice (sidebar state, theme, etc.)
const appPersistConfig = {
  key: 'app',
  storage,
  whitelist: ['sidebarCollapsed', 'theme', 'language'], // Only persist these fields
};

const userPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'],
};

const persistedAppReducer = persistReducer(appPersistConfig, appReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: persistedUserReducer,
    app: persistedAppReducer,
    spotify: spotifyReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
