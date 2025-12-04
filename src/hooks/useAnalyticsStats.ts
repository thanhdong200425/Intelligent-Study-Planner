import { useQuery } from '@tanstack/react-query';
import { getAnalyticsStats } from '@/services/analytics';

export const useAnalyticsStats = () => {
  return useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: getAnalyticsStats,
  });
};
