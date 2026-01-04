import { useQuery } from '@tanstack/react-query';
import { getActiveTimerSession, getTodayTimerSessions } from '@/services';
import { TimerSession } from '@/types';

export const useActiveTimerSession = () => {
  return useQuery<TimerSession | null>({
    queryKey: ['timerSession', 'active'],
    queryFn: () => getActiveTimerSession(),
    refetchInterval: 5000, // Refetch every 5 seconds to keep active session in sync
  });
};

export const useTodayTimerSessions = () => {
  return useQuery<TimerSession[]>({
    queryKey: ['timerSession', 'today'],
    queryFn: () => getTodayTimerSessions(),
  });
};
