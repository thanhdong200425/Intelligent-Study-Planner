import { TaskFormData } from "@/components/forms/TaskForm";
import { createTask } from "@/services";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface MutationProps {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}


export const useCreateTaskMutation = ({ onSuccess, onError }: MutationProps) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TaskFormData) => createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            addToast({
                title: 'Task added successfully',
                color: 'success',
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            })
            onSuccess?.();
        },
        onError: (error) => {
            addToast({
                title: 'Failed to add task',
                color: 'danger',
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            })
            console.error('Failed to add task:', error);
            onError?.(error);
        }
    });
}