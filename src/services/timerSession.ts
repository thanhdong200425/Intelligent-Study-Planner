import { apiClient } from '@/lib/api';
import { CreateTimerSessionData } from '@/mutations';
import { TimerSession } from '@/types';

const endpoint = {
  timerSession: '/timer-session',
};

export const createTimerSession = async (
  data: CreateTimerSessionData
): Promise<TimerSession> => {
  try {
    const response = await apiClient.post(endpoint.timerSession, data);
    return response.data;
  } catch (err) {
    console.log('Error creating timer session: ', err);
    throw err;
  }
};

export const updateTimerSession = async (
  id: number,
  data: Partial<CreateTimerSessionData>
): Promise<TimerSession> => {
  try {
    const response = await apiClient.patch(
      `${endpoint.timerSession}/${id}`,
      data
    );
    return response.data;
  } catch (err) {
    console.log('Error updating timer session: ', err);
    throw err;
  }
};

export const getTodayTimerSessions = async (): Promise<TimerSession[]> => {
  try {
    const response = await apiClient.get(`${endpoint.timerSession}/today`);
    return response.data;
  } catch (err) {
    console.log('Error fetching today timer sessions: ', err);
    return [];
  }
};
