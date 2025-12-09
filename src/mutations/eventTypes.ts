import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEventType,
  updateEventType,
  deleteEventType,
  CreateEventTypeRequest,
  UpdateEventTypeRequest,
} from '@/services/eventTypes';
import { MutationProps } from './task';

export const useCreateEventTypeMutation = ({
  onError,
  onSuccess,
}: Pick<MutationProps, 'onError'> & { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventTypeRequest) => createEventType(data),
    onSuccess: () => {
      addToast({
        title: 'Event type created successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to create event type:', error);
      addToast({
        title: 'Failed to create event type',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onError?.(error);
    },
  });
};

export const useUpdateEventTypeMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventTypeRequest }) =>
      updateEventType(id, data),
    onSuccess: () => {
      addToast({
        title: 'Event type updated successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to update event type:', error);
      addToast({
        title: 'Failed to update event type',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onError?.(error);
    },
  });
};

export const useDeleteEventTypeMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEventType(id),
    onSuccess: () => {
      addToast({
        title: 'Event type deleted successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to delete event type:', error);
      addToast({
        title: 'Failed to delete event type',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onError?.(error);
    },
  });
};
