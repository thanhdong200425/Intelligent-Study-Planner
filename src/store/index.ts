import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import userReducer from '@/store/slices/userSlice';
import appReducer from '@/store/slices/appSlice';
import spotifyReducer from '@/store/slices/spotifySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    app: appReducer,
    spotify: spotifyReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
