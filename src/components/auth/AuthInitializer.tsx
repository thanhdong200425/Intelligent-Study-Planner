'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { refreshAccessToken } from '@/services/auth';
import { setAccessToken } from '@/store/slices/authSlice';
import { usePathname } from 'next/navigation';

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        setIsChecking(false);
        return;
      }

      if (['/auth', '/verify'].some(route => pathname.startsWith(route))) {
        setIsChecking(false);
        return;
      }

      try {
        const result = await refreshAccessToken();
        dispatch(setAccessToken(result.accessToken));
      } catch (error) {
      } finally {
        setIsChecking(false);
      }
    };

    initAuth();
  }, [accessToken, dispatch, pathname]);

  // Optional: Show a loading spinner while we check the session
  if (isChecking) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-gray-50'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  return <>{children}</>;
}
