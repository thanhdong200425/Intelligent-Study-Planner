'use client';

import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { getAllTasks } from '@/services';
import { useMemo } from 'react';
import { TaskFilter } from './TaskFilters';
import { useQuery } from '@tanstack/react-query';

const priorityRank: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

interface TaskListProps {
  searchQuery?: string;
  handleToggleComplete?: (task: Task) => void;
  activeFilter?: TaskFilter;
  sortOrder?: 'asc' | 'desc';
}

const TaskList: React.FC<TaskListProps> = ({
  searchQuery,
  handleToggleComplete = () => {},
  activeFilter = 'all',
  sortOrder = 'desc',
}) => {
  const taskPriorityRank = (priority?: Task['priority']) => {
    if (!priority) {
      return 0;
    }
    return priorityRank[priority] ?? 0;
  };

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks,
  });

  const filteredTasks = useMemo(() => {
    if (!tasks) {
      return [];
    }

    if (activeFilter === 'priority') {
      return tasks
        .filter(task => !!task.priority)
        .sort((a, b) => {
          const rankA = taskPriorityRank(a.priority);
          const rankB = taskPriorityRank(b.priority);
          const comparison = rankA - rankB;
          return sortOrder === 'asc' ? comparison : -comparison;
        });
    }

    return tasks;
  }, [tasks, activeFilter, sortOrder]);

  if (!tasks || tasks.length === 0) {
    return (
      <div className='bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-8 text-center'>
        <p className='text-gray-500'>
          {searchQuery
            ? 'No tasks found matching your search.'
            : 'No tasks yet. Click "Add Task" to create your first task!'}
        </p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className='bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-8 text-center'>
        <p className='text-gray-500'>
          {activeFilter === 'priority'
            ? 'No prioritized tasks found.'
            : 'No course-linked tasks found.'}
        </p>
      </div>
    );
  }

  return (
    <>
      {filteredTasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </>
  );
};

export default TaskList;
