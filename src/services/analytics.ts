import apiClient from '@/lib/api';

export interface AnalyticsStats {
  studyHoursThisWeek: number;
  studyHoursGrowthRate: number;
  coursesEnrolled: number;
  totalStudyHours: number;
  totalStudyHoursGrowthRate: number;
  taskCompletionRate: number;
}

const endpoint = {
  stats: '/analytics/stats',
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
