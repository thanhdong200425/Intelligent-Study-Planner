import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuth } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export const useSessionValidation = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, session, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Check if session is expired based on Redux state
    if (isAuthenticated && session && new Date() > new Date(session.expiresAt)) {
      dispatch(clearAuth());
      router.push('/auth');
      return;
    }
  }, [isAuthenticated, session, dispatch, router]);

  return {
    isAuthenticated,
    user,
    session,
  };
};

export default useSessionValidation;
