import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { registerOrLogin } from '@/mutations/auth';

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

// Async thunk for authentication
export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerOrLogin(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Authentication failed'
      );
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Clear session cookie
      if (typeof document !== 'undefined') {
        document.cookie =
          'sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      return true;
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Async thunk for checking authentication status
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      // Check if session cookie exists
      if (typeof document !== 'undefined') {
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('sid='));

        const hasSession =
          !!sessionCookie && sessionCookie.split('=')[1] !== '';
        return hasSession;
      }
      return false;
    } catch (error: any) {
      return rejectWithValue('Failed to check authentication status');
    }
  }
);

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
  extraReducers: builder => {
    // Authenticate user
    builder
      .addCase(authenticateUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || {
          id: action.payload.id || '',
          email: action.payload.email || '',
          name: action.payload.name,
          role: action.payload.role,
        };
        state.error = null;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        state.redirectTo = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check auth status
    builder
      .addCase(checkAuthStatus.pending, state => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload;
        if (!action.payload) {
          state.user = null;
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { setRedirectTo, clearError, setUser, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
