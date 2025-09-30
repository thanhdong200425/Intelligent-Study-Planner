'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuthStatus } from '@/store/slices/authSlice';

// Component to handle authentication status checking
function AuthChecker({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Check authentication status on mount
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return <>{children}</>;
}

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthChecker>{children}</AuthChecker>
    </Provider>
  );
}
