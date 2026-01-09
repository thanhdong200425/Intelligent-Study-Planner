import { useQuery } from '@tanstack/react-query';
import {
  getAnalyticsStats,
  getWeeklyStudyHours,
  getTaskDistribution,
  getStudyTimeByCourse,
} from '@/services/analytics';

export const useAnalyticsStats = () => {
  return useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: getAnalyticsStats,
  });
};

export const useWeeklyStudyHours = () => {
  return useQuery({
    queryKey: ['analytics', 'weekly-study-hours'],
    queryFn: getWeeklyStudyHours,
  });
};

export const useTaskDistribution = () => {
  return useQuery({
    queryKey: ['analytics', 'task-distribution'],
    queryFn: getTaskDistribution,
  });
};

export const useStudyTimeByCourse = () => {
  return useQuery({
    queryKey: ['analytics', 'study-time-by-course'],
    queryFn: getStudyTimeByCourse,
  });
};
