import { useQuery } from '@tanstack/react-query';
import { getAllTasks } from '@/services';
import { Task } from '@/types';

export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => getAllTasks({ includeCourse: true }),
  });
};
