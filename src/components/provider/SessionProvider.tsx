'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuth } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { session, isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Set up periodic session expiry validation
    const interval = setInterval(() => {
      // Check if session is expired based on Redux state
      if (
        isAuthenticated &&
        session &&
        new Date() > new Date(session.expiresAt)
      ) {
        dispatch(clearAuth());
        router.push('/auth');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [dispatch, router, isAuthenticated, session]);

  return <>{children}</>;
};

export default SessionProvider;
