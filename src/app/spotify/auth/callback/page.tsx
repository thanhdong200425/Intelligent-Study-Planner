'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  setSpotifyAccessToken,
  setSpotifyError,
} from '@/store/slices/spotifySlice';
import { baseURL } from '@/lib/api';
import axios from 'axios';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      dispatch(setSpotifyError(error));
      router.push('/');
      return;
    }

    if (code) {
      // Exchange code for token
      axios
        .get(`${baseURL}/spotify/auth/callback?code=${code}`)
        .then(response => {
          const { access_token } = response.data;
          if (access_token) {
            dispatch(setSpotifyAccessToken(access_token));
          }
          router.push('/');
        })
        .catch(err => {
          console.error('Spotify auth error:', err);
          dispatch(setSpotifyError('Failed to authenticate with Spotify'));
          router.push('/');
        });
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h2 className='text-xl font-semibold mb-2'>Connecting to Spotify...</h2>
        <p className='text-gray-500'>
          Please wait while we complete the setup.
        </p>
      </div>
    </div>
  );
}

export default function SpotifyCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
