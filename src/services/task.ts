import apiClient from '@/lib/api';
import { Task } from '@/types';
import { sendRequestFromServer } from './serverActions';

const endpoint = '/tasks';

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await sendRequestFromServer(endpoint);
    return response;
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

// export const addTask = async (taskData: Task): Promise<Task> => {
//   try {
//   } catch (err) {
//     console.log('Error adding task: ', err);
//     throw err;
//   }
// };
