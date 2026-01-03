import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFeedback,
  type CreateFeedbackRequest,
} from '@/services/feedback';
import { addToast } from '@heroui/react';

export const useCreateFeedbackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeedbackRequest) => createFeedback(data),
    onSuccess: () => {
      addToast({
        title: 'Feedback submitted successfully! Thank you for your input.',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
    onError: (error: Error) => {
      addToast({
        title: error.message || 'Failed to submit feedback',
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};
