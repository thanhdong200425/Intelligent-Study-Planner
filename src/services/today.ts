import apiClient from '@/lib/api';
import { Task, Deadline, AvailabilityWindow } from '@/types';

export interface TodayStats {
  tasksCompletedToday: number;
  totalOpenTasks: number;
  timeRemaining: number;
  highPriorityCount: number;
  dayStreak: number;
}

export interface TodayResponse {
  todaysTasks: Task[];
  upcomingDeadlines: Deadline[];
  availabilityToday: AvailabilityWindow[];
  stats: TodayStats;
}

const endpoint = '/today';

export const getTodayData = async (): Promise<TodayResponse> => {
  try {
    const response = await apiClient.get<TodayResponse>(endpoint);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch today data'
    );
  }
};
