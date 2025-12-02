import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/services/event';
import { Event } from '@/types';

export const useEvents = () => {
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => getEvents(),
  });
};
