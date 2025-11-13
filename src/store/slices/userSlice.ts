import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import UserApiService, { type UserProfile, type UpdateUserRequest } from '@/services/userApi';

// Extend UserProfile from API service to include additional fields if needed
export interface ExtendedUserProfile extends UserProfile {
  avatar?: string;
  role?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  profile: ExtendedUserProfile | null;
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
      const profile = await UserApiService.getProfile();
      return profile as ExtendedUserProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: UpdateUserRequest, { rejectWithValue }) => {
    try {
      const updatedProfile = await UserApiService.updateProfile(profileData);
      return updatedProfile as ExtendedUserProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user profile');
    }
  }
);

// Async thunk for updating user preferences
export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (
    preferences: Partial<ExtendedUserProfile['preferences']>,
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

      // Note: If backend has a separate preferences endpoint, update this
      // For now, we'll update preferences locally
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
    setProfile: (state, action: PayloadAction<ExtendedUserProfile | null>) => {
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
      action: PayloadAction<Partial<ExtendedUserProfile>>
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
