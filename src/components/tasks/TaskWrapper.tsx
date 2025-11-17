'use client';

import { useState } from 'react';
import { TaskStatsCards } from '@/components/tasks/TaskStatsCards';
import { TaskFilters, TaskFilter } from '@/components/tasks/TaskFilters';
import TaskList from '@/components/tasks/TaskList';

type SortOrder = 'asc' | 'desc';

const TaskWrapper = () => {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleFilterChange = (filter: TaskFilter) => {
    if (filter === activeFilter) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setActiveFilter(filter);
    setSortOrder('desc');
  };

  return (
    <>
      <TaskStatsCards />
      <TaskFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        sortOrder={sortOrder}
      />
      <TaskList activeFilter={activeFilter} sortOrder={sortOrder} />
    </>
  );
};

export default TaskWrapper;
