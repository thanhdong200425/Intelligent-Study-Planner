import { TaskFormData } from '@/components/forms/TaskForm';
import {
  createTask,
  deleteTask,
  handleToggleCompleteStatus,
  updateTask,
  sendImageToModel,
  createMultipleTasks,
} from '@/services';
import { Task, ExtractedTask } from '@/types';
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
          Number(task.id) === taskId ? { ...task, completed } : task
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

export interface AnalyzeImageMutationProps {
  onSuccess?: (data: {
    tasks: ExtractedTask[];
    message: string;
    statusCode: number;
  }) => void;
  onError?: (error: Error) => void;
}

export const useSendImageToModelMutation = ({
  onSuccess,
  onError,
}: AnalyzeImageMutationProps) => {
  return useMutation({
    mutationFn: ({
      file,
      additionalContext,
    }: {
      file: File;
      additionalContext?: string;
    }) => sendImageToModel(file, additionalContext),
    onSuccess: data => {
      addToast({
        title: 'Image analyzed successfully',
        color: 'success',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.(data);
    },
    onError: error => {
      addToast({
        title: 'Failed to analyze image',
        color: 'danger',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      console.error('Failed to analyze image:', error);
      onError?.(error);
    },
  });
};

export const useCreateMultipleTasksMutation = ({
  onSuccess,
  onError,
}: MutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tasks: TaskFormData[]) => createMultipleTasks(tasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast({
        title: 'Tasks created successfully',
        color: 'success',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      onSuccess?.();
    },
    onError: error => {
      addToast({
        title: 'Failed to create tasks',
        color: 'danger',
        timeout: 1000,
        shouldShowTimeoutProgress: true,
      });
      console.error('Failed to create tasks:', error);
      onError?.(error);
    },
  });
};
