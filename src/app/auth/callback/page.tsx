'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAccessToken, setAuthData } from '@/store/slices/authSlice';
import apiClient from '@/lib/api';
import { addToast } from '@heroui/react';
import { getProfile } from '@/services/user';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');

      if (!token) {
        addToast({
          title: 'Authentication Failed',
          description: 'No access token received from OAuth provider.',
          color: 'danger',
        });
        router.push('/auth?error=oauth_failed');
        return;
      }

      try {
        // Temporarily set access token so API client can use it
        dispatch(setAccessToken(token));

        // Fetch user data using the access token (follows normal login flow)
        const response = await getProfile();

        // Set complete auth data (user + token), same as normal login
        dispatch(
          setAuthData({
            user: response,
            accessToken: token,
          })
        );

        addToast({
          title: 'Success',
          description: 'Login successful! Welcome back.',
          color: 'success',
        });

        // Redirect to home, same as normal login
        router.push('/');
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        addToast({
          title: 'Authentication Failed',
          description: error.message || 'Failed to complete OAuth login.',
          color: 'danger',
        });
        router.push('/auth?error=oauth_failed');
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, dispatch]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h2 className='text-xl font-semibold mb-2'>
          {isLoading ? 'Completing sign in...' : 'Redirecting...'}
        </h2>
        <p className='text-gray-600'>Please wait</p>
      </div>
    </div>
  );
}
