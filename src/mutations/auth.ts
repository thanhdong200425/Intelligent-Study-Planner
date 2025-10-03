import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { addToast } from '@heroui/react';
import { useAppDispatch } from '@/store/hooks';
import { setTemporaryEmail } from '@/store/slices/appSlice';
import { 
  login, 
  register, 
  checkAuthMode, 
  type AuthCredentials, 
  type AuthTypeResponse 
} from '@/services/auth';

export const useLoginMutation = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => login(credentials),
    onSuccess: (data) => {
      addToast({
        title: 'Success',
        description: 'Login successful! Welcome back.',
        color: 'success',
      });
      
      // Redirect to dashboard or intended page
      router.push('/dashboard');
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
    onSuccess: (data) => {
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
        description: error.message || 'An error occurred while checking your account.',
        color: 'danger',
      });
    },
  });
};

// Custom hook for logout (if you have a logout endpoint)
export const useLogoutMutation = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      addToast({
        title: 'Success',
        description: 'You have been logged out successfully.',
        color: 'success',
      });
      
      router.push('/auth');
    },
    onError: (error: Error) => {
      addToast({
        title: 'Error',
        description: 'An error occurred during logout.',
        color: 'danger',
      });
    },
  });
};
