import { createTimerSession, updateTimerSession } from '@/services';
import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationProps } from './task';

export interface CreateTimerSessionData {
  type: 'focus' | 'break' | 'long_break';
  taskId: number | null;
  timeBlockId: number | null;
  startTime: string;
}

export interface UpdateTimerSessionData
  extends Partial<CreateTimerSessionData> {
  endTime?: string;
  durationMinutes?: number;
  status?: 'active' | 'completed' | 'stopped';
}

export const useCreateTimerSessionMutation = ({
  onError,
  onSuccess,
}: Pick<MutationProps, 'onError'> & { onSuccess?: (id: number) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimerSessionData) => createTimerSession(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['timerSession'] });
      addToast({
        title: 'Timer session created successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.(Number(data.id));
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

export const useUpdateTimerSessionMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTimerSessionData }) =>
      updateTimerSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timerSession'] });
      addToast({
        title: 'Timer session updated successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to update timer session:', error);
      addToast({
        title: 'Failed to update timer session',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onError?.(error);
    },
  });
};
