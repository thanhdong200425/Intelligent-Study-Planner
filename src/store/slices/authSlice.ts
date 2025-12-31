import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  name: string | null;
  avatar?: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  redirectTo: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  redirectTo: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRedirectTo: (state, action: PayloadAction<string | null>) => {
      state.redirectTo = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    setAuthData: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAuth: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.redirectTo = null;
    },
  },
});

export const {
  setRedirectTo,
  clearError,
  setAccessToken,
  setAuthData,
  clearAuth,
} = authSlice.actions;
export default authSlice.reducer;
