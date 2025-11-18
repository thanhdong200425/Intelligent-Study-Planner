'use client';

import { useState, useEffect } from 'react';
import { TaskStatsCards } from '@/components/tasks/TaskStatsCards';
import { TaskFilter } from '@/components/tasks/TaskSort';
import TaskList from '@/components/tasks/TaskList';
import TaskSort from '@/components/tasks/TaskSort';
import CustomView from '@/components/tasks/CustomView';
import { CustomViewData } from '@/components/tasks/AddCustomViewModal';
import { CustomViewsStorage, SavedCustomView } from '@/services/customViews';

type SortOrder = 'asc' | 'desc';

const TaskWrapper = () => {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [customViews, setCustomViews] = useState<SavedCustomView[]>([]);

  // Load custom views from localStorage on mount
  useEffect(() => {
    const views = CustomViewsStorage.getAll();
    setCustomViews(views);
  }, []);

  const handleFilterChange = (filter: TaskFilter) => {
    if (filter === activeFilter) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setActiveFilter(filter);
    setSortOrder('desc');
  };

  const handleAddView = (viewData: CustomViewData) => {
    try {
      const savedView = CustomViewsStorage.save(viewData);
      setCustomViews(prev => [...prev, savedView]);
    } catch (error) {
      console.error('Error saving custom view:', error);
    }
  };

  const handleDeleteView = (viewId: string) => {
    CustomViewsStorage.delete(viewId);
    setCustomViews(prev => prev.filter(view => view.id !== viewId));
  };

  const handleApplyView = (view: SavedCustomView) => {
    // Apply the filter
    if (view.filter) {
      const filter = view.filter as TaskFilter;
      setActiveFilter(filter);
    }

    // Apply the sort order based on sortBy
    if (view.sortBy) {
      if (view.sortBy.includes('-asc')) {
        setSortOrder('asc');
      } else if (view.sortBy.includes('-desc')) {
        setSortOrder('desc');
      }
    }
  };

  return (
    <>
      <TaskStatsCards />
      <div className='flex gap-4'>
        <div className='flex-1'>
          <TaskSort
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            sortOrder={sortOrder}
          />
        </div>
        <div className='flex-1'>
          <CustomView
            onAddView={handleAddView}
            customViews={customViews}
            onDeleteView={handleDeleteView}
            onApplyView={handleApplyView}
          />
        </div>
      </div>
      <TaskList activeFilter={activeFilter} sortOrder={sortOrder} />
    </>
  );
};

export default TaskWrapper;
