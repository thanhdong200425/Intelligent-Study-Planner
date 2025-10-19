import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
};

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // This would typically make an API call to fetch user profile
      // For now, we'll simulate it
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user profile');
    }
  }
);

// Async thunk for updating user preferences
export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (
    preferences: Partial<UserProfile['preferences']>,
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as any;
      const currentProfile = state.user.profile;

      if (!currentProfile) {
        throw new Error('No user profile found');
      }

      const updatedPreferences = {
        ...currentProfile.preferences,
        ...preferences,
      };

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update user preferences');
      }

      return updatedPreferences;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to update user preferences'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    clearUser: state => {
      state.profile = null;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    updateProfileLocally: (
      state,
      action: PayloadAction<Partial<UserProfile>>
    ) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
  extraReducers: builder => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, state => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Update user preferences
    builder
      .addCase(updateUserPreferences.pending, state => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile.preferences = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProfile, clearUser, clearError, updateProfileLocally } =
  userSlice.actions;
export default userSlice.reducer;
