import apiClient from '@/lib/api';

export interface AnalyticsStats {
  studyHoursThisWeek: number;
  studyHoursGrowthRate: number;
  coursesEnrolled: number;
  totalStudyHours: number;
  totalStudyHoursGrowthRate: number;
  taskCompletionRate: number;
}

export interface WeeklyStudyHour {
  day: string;
  hours: number;
}

export interface TaskDistribution {
  name: string;
  value: number;
  color: string;
}

export interface StudyTimeByCourse {
  course: string;
  hours: number;
}

export interface FocusHoursHeatmapData {
  date: string;
  hours: number;
}

const endpoint = {
  stats: '/analytics/stats',
  weeklyStudyHours: '/analytics/weekly-study-hours',
  taskDistribution: '/analytics/task-distribution',
  studyTimeByCourse: '/analytics/study-time-by-course',
  focusHoursHeatmap: '/analytics/focus-hours-heatmap',
};

export const getAnalyticsStats = async (): Promise<AnalyticsStats> => {
  try {
    const response = await apiClient.get<AnalyticsStats>(endpoint.stats);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch analytics stats'
    );
  }
};

export const getWeeklyStudyHours = async (): Promise<WeeklyStudyHour[]> => {
  try {
    const response = await apiClient.get<WeeklyStudyHour[]>(
      endpoint.weeklyStudyHours
    );
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch weekly study hours'
    );
  }
};

export const getTaskDistribution = async (): Promise<TaskDistribution[]> => {
  try {
    const response = await apiClient.get<TaskDistribution[]>(
      endpoint.taskDistribution
    );
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch task distribution'
    );
  }
};

export const getStudyTimeByCourse = async (): Promise<StudyTimeByCourse[]> => {
  try {
    const response = await apiClient.get<StudyTimeByCourse[]>(
      endpoint.studyTimeByCourse
    );
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch study time by course'
    );
  }
};

export const getFocusHoursHeatmap = async (): Promise<
  FocusHoursHeatmapData[]
> => {
  try {
    const response = await apiClient.get<FocusHoursHeatmapData[]>(
      endpoint.focusHoursHeatmap
    );
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch focus hours heatmap'
    );
  }
};
