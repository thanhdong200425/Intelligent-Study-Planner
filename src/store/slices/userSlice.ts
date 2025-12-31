import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@/types';
import type { UpdateUserRequest } from '@/services/user';

// FE UserProfile + extra fields
export interface ExtendedUserProfile extends Omit<UserProfile, 'avatar'> {
  emailAddress?: string;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string | null; // Match UserProfile's avatar type
  role?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
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

/* ===========================================================
    REMOVE ALL API LOGIC — asyncThunk now acts as local actions
   =========================================================== */

// Update preferences locally
export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (
    preferences: Partial<ExtendedUserProfile['preferences']>,
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as any;
      const current = state.user.profile;

      if (!current) {
        throw new Error('No user profile found');
      }

      return {
        ...current.preferences,
        ...preferences,
      };
    } catch (error: any) {
      return rejectWithValue('Failed to update user preferences');
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
    // Update preferences locally
    builder.addCase(updateUserPreferences.fulfilled, (state, action) => {
      if (state.profile) {
        state.profile.preferences = action.payload;
      }
    });
  },
});

export const { setProfile, clearUser, clearError, updateProfileLocally } =
  userSlice.actions;

export default userSlice.reducer;
