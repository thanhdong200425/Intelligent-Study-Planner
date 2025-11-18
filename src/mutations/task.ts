import { TaskFormData } from '@/components/forms/TaskForm';
import {
  createTask,
  deleteTask,
  handleToggleCompleteStatus,
  updateTask,
} from '@/services';
import { Task } from '@/types';
import { addToast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface MutationProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateTaskMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskFormData) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast({
        title: 'Task added successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: error => {
      addToast({
        title: 'Failed to add task',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      console.error('Failed to add task:', error);
      onError?.(error);
    },
  });
};

export const useToggleCompleteTaskMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => handleToggleCompleteStatus(taskId),
    onSuccess: (completed: boolean, taskId: number) => {
      // Update the cached data
      queryClient.setQueryData<Task[]>(['tasks'], oldTasks => {
        if (!oldTasks) return [];
        return oldTasks.map(task =>
          task.id === taskId ? { ...task, completed } : task
        );
      });
      if (completed) {
        addToast({
          title: 'Congratulations, you completed a task!',
          color: 'success',
          timeout: 1000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: 'Task not completed',
          color: 'warning',
          timeout: 1000,
          shouldShowTimeoutProgress: true,
        });
      }
      onSuccess?.();
    },
    onError: error => {
      addToast({
        title: 'Failed to complete task',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      console.error('Failed to complete task:', error);
      onError?.(error);
    },
  });
};

export const useUpdateTaskMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: TaskFormData }) =>
      updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast({
        title: 'Task updated successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: error => {
      addToast({
        title: 'Failed to update task',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      console.error('Failed to update task:', error);
      onError?.(error);
    },
  });
};

export const useDeleteTaskMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast({
        title: 'Task deleted successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: error => {
      addToast({
        title: 'Failed to delete task',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      console.error('Failed to add task:', error);
      onError?.(error);
    },
  });
};
