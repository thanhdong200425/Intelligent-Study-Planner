import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SpotifyState {
  accessToken: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: SpotifyState = {
  accessToken: null,
  isConnected: false,
  isLoading: false,
  error: null,
};

const spotifySlice = createSlice({
  name: 'spotify',
  initialState,
  reducers: {
    setSpotifyAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isConnected = true;
      state.error = null;
    },
    setSpotifyLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSpotifyError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    disconnectSpotify: (state) => {
      state.accessToken = null;
      state.isConnected = false;
      state.error = null;
    },
  },
});

export const {
  setSpotifyAccessToken,
  setSpotifyLoading,
  setSpotifyError,
  disconnectSpotify,
} = spotifySlice.actions;

export default spotifySlice.reducer;
