import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface SessionInfo {
  sessionId: number;
  expiresAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: SessionInfo | null;
  error: string | null;
  redirectTo: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  session: null,
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
    setSession: (state, action: PayloadAction<SessionInfo | null>) => {
      state.session = action.payload;
    },
    setAuthData: (state, action: PayloadAction<{ user: User; session: SessionInfo }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearAuth: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.session = null;
      state.error = null;
      state.redirectTo = null;
    },
  },
});

export const { setRedirectTo, clearError, setUser, setSession, setAuthData, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
