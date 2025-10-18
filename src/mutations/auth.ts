import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { addToast } from '@heroui/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTemporaryEmail } from '@/store/slices/appSlice';
import {
  login,
  register,
  logout,
  checkAuthMode,
  type AuthCredentials,
  type AuthTypeResponse,
  type LoginResponse,
} from '@/services/auth';
import { setAuthData, clearAuth } from '@/store/slices/authSlice';

export const useLoginMutation = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => login(credentials),
    onSuccess: (data: LoginResponse) => {
      addToast({
        title: 'Success',
        description: 'Login successful! Welcome back.',
        color: 'success',
      });

      // Update Redux store with user data
      dispatch(
        setAuthData({
          user: data.user,
        })
      );

      // Clear temporary email
      dispatch(setTemporaryEmail(null));

      router.push('/');
    },
    onError: (error: Error) => {
      addToast({
        title: 'Login Failed',
        description: error.message || 'An error occurred during login.',
        color: 'danger',
      });
    },
  });
};

// Register mutation
export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => register(credentials),
    onSuccess: data => {
      addToast({
        title: 'Success',
        description: 'Account created successfully! Please verify your email.',
        color: 'success',
      });

      router.push('/verify');
    },
    onError: (error: Error) => {
      addToast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration.',
        color: 'danger',
      });
    },
  });
};

// Check auth mode mutation (to determine if user should login or register)
export const useCheckAuthModeMutation = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: Pick<AuthCredentials, 'email'>) => checkAuthMode(data),
    onSuccess: (result: AuthTypeResponse | null, variables) => {
      if (result === null) {
        throw new Error('Unable to determine authentication mode');
      }

      // Store the email temporarily
      dispatch(setTemporaryEmail(variables.email));

      // Navigate to appropriate auth page
      router.push(`/auth/${result}`);
    },
    onError: (error: Error) => {
      addToast({
        title: 'Error',
        description:
          error.message || 'An error occurred while checking your account.',
        color: 'danger',
      });
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      // Clear Redux auth state
      dispatch(clearAuth());

      addToast({
        title: 'Success',
        description: 'You have been logged out successfully.',
        color: 'success',
      });

      router.push('/auth');
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local state
      dispatch(clearAuth());

      addToast({
        title: 'Error',
        description:
          'An error occurred during logout, but you have been logged out',
        color: 'warning',
      });

      router.push('/auth');
    },
  });
};
