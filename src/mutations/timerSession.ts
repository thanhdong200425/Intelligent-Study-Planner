import { createTimerSession } from '@/services';
import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { MutationProps } from './task';

export interface CreateTimerSessionData {
  type: 'focus' | 'break' | 'long_break';
  taskId: number | null;
  timeBlockId: number | null;
  startTime: string;
}

export const useCreateTimerSessionMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  return useMutation({
    mutationFn: (data: CreateTimerSessionData) => createTimerSession(data),
    onSuccess: () => {
      addToast({
        title: 'Timer session created successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to create timer session:', error);
      addToast({
        title: 'Failed to create timer session',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onError?.(error);
    },
  });
};
