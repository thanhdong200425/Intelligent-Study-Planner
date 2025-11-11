import apiClient from '@/lib/api';
import { Task } from '@/types';
import { cookies } from 'next/headers';
import { refreshAccessTokenForServer } from './auth';

const endpoint = '/tasks';

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    // Get the cookie from the incoming request
    const cookieStore = await cookies();
    const cookieName = process.env.COOKIE_NAME;
    if (!cookieName) throw new Error('COOKIE_NAME is not set');
    const clientCookie = cookieStore.get(cookieName);
    if (!clientCookie) throw new Error('Client cookie not found');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`,
      {
        headers: {
          Cookie: `${cookieName}=${clientCookie.value}`,
        },
        credentials: 'include',
      }
    );
    if (response.status === 401) {
      const { accessToken } = await refreshAccessTokenForServer();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`,
        {
          headers: {
            Cookie: `=${clientCookie.value}`,
          },
        }
      );
    }
    const data = await response.json();
    return data;
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
