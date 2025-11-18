import { updateProfile, type UpdateUserRequest } from '@/services/user';
import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationProps } from './task';

export const useUpdateProfileMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      addToast({
        title: 'Information saved successfully!',
        color: 'success',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: error => {
      addToast({
        title: 'Update failed. Please try again.',
        color: 'danger',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      console.error('Failed to update profile:', error);
      onError?.(error);
    },
  });
};
