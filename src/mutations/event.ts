import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, CreateEventRequest } from '@/services/event';
import { MutationProps } from './task';

export const useCreateEventMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      addToast({
        title: 'Event created successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to create event:', error);
      addToast({
        title: 'Failed to create event',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onError?.(error);
    },
  });
};
