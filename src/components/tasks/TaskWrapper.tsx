'use client';

import { useState } from 'react';
import { TaskStatsCards } from '@/components/tasks/TaskStatsCards';
import { TaskFilter } from '@/components/tasks/TaskSort';
import TaskList from '@/components/tasks/TaskList';
import TaskSort from '@/components/tasks/TaskSort';

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
      <div>
        <TaskSort
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          sortOrder={sortOrder}
        />
      </div>
      <TaskList activeFilter={activeFilter} sortOrder={sortOrder} />
    </>
  );
};

export default TaskWrapper;
