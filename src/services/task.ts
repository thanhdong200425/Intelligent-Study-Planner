import apiClient from '@/lib/api';
import { Task } from '@/types';
import { sendRequestFromServer } from './serverActions';
import { TaskFormData } from '@/components/forms/TaskForm';

const endpoint = '/tasks';

export const getAllTasks = async ({
  includeCourse,
}: {
  includeCourse?: boolean;
}): Promise<Task[]> => {
  try {
    const response = await apiClient.get(endpoint, {
      params: { includeCourse: includeCourse ?? false },
    });
    return response.data;
  } catch (err) {
    console.log('Error fetching tasks: ', err);
    return [];
  }
};

export const handleToggleCompleteStatus = async (
  taskId: number
): Promise<boolean> => {
  try {
    const response = await apiClient.patch(
      `${endpoint}/${taskId}/toggle-complete`
    );
    return response.data;
  } catch (err) {
    console.log('Error toggling task completion: ', err);
    throw err;
  }
};

export const createTask = async (task: TaskFormData): Promise<Task> => {
  try {
    const response = await apiClient.post(endpoint, task);
    return response.data;
  } catch (err) {
    console.log('Error creating task: ', err);
    throw err;
  }
};

export const updateTask = async (
  taskId: number,
  task: TaskFormData
): Promise<Task> => {
  try {
    const response = await apiClient.put(`${endpoint}/${taskId}`, task);
    return response.data;
  } catch (err) {
    console.log('Error updating task: ', err);
    throw err;
  }
};

export const deleteTask = async (taskId: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`${endpoint}/${taskId}`);
    return response.data;
  } catch (err) {
    console.log('Error creating task: ', err);
    throw err;
  }
};
