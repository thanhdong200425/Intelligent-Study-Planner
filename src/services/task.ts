import apiClient from '@/lib/api';
import { Task, ExtractedTask } from '@/types';
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

/* 
  This function sends an image to the model to be analyzed for tasks and see preview of the tasks without creating them.
  @param file - the image file to send to the model
  @param additionalContext - additional context to add to the prompt
  @returns the tasks extracted from the image
*/

interface SendImageToModelResponse {
  tasks: ExtractedTask[];
  message: string;
  statusCode: number;
}

export const sendImageToModel = async (
  file: File,
  additionalContext?: string
): Promise<SendImageToModelResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    if (additionalContext) {
      formData.append('additionalContext', additionalContext);
    }

    const response = await apiClient.post(
      '/tasks/image/preview-image-tasks',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log('Error sending image to model: ', err);
    throw err;
  }
};

export const createMultipleTasks = async (
  tasks: TaskFormData[]
): Promise<Task[]> => {
  try {
    const response = await apiClient.post(`${endpoint}/add-multiple`, tasks);
    return response.data;
  } catch (err) {
    console.log('Error creating multiple tasks: ', err);
    throw err;
  }
};

// Request an ephemeral token from the server
export const requestEphemeralToken = async () => {
  try {
    const response = await apiClient.post(
      `${endpoint}/live/request-ephemeral-token`
    );
    return response.data;
  } catch (err) {
    console.log('Error requesting ephemeral token: ', err);
    throw err;
  }
};
