import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEvent,
  CreateEventRequest,
  updateEvent,
  deleteEvent,
} from '@/services/event';

type UpdateEventRequest = Partial<CreateEventRequest>;
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

export const useUpdateEventMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventRequest }) =>
      updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      addToast({
        title: 'Event updated successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to update event:', error);
      addToast({
        title: 'Failed to update event',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onError?.(error);
    },
  });
};

export const useDeleteEventMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      addToast({
        title: 'Event deleted successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to delete event:', error);
      addToast({
        title: 'Failed to delete event',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onError?.(error);
    },
  });
};
