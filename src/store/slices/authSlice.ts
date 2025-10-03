import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  redirectTo: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  redirectTo: null,
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
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.redirectTo = null;
    },
  },
});

export const { setRedirectTo, clearError, setUser, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
