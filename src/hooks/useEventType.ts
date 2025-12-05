import { useQuery } from '@tanstack/react-query';
import { getEventTypes, getEventTypeById } from '@/services/eventTypes';
import { EventType } from '@/types';

export const useEventTypes = () => {
  return useQuery<EventType[]>({
    queryKey: ['event-types'],
    queryFn: () => getEventTypes(),
  });
};

export const useEventType = (id: number) => {
  return useQuery<EventType>({
    queryKey: ['event-types', id],
    queryFn: () => getEventTypeById(id),
    enabled: !!id,
  });
};
