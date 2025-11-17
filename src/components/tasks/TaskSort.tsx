'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Filter, ArrowUp, ArrowDown } from 'lucide-react';

export type TaskFilter = 'all' | 'priority' | 'course';

interface TaskSortProps {
  activeFilter: TaskFilter;
  onFilterChange?: (filter: TaskFilter) => void;
  sortOrder?: 'asc' | 'desc';
}

const TaskSort: React.FC<TaskSortProps> = ({
  activeFilter,
  onFilterChange = () => {},
  sortOrder = 'desc',
}) => {
  const filters: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'priority', label: 'Priority' },
  ];

  const sortableFilters: TaskFilter[] = ['priority'];

  const getSortIcon = (filterKey: TaskFilter) => {
    if (activeFilter !== filterKey || !sortableFilters.includes(filterKey)) {
      return null;
    }

    return sortOrder === 'asc' ? (
      <ArrowUp className='w-3.5 h-3.5' />
    ) : (
      <ArrowDown className='w-3.5 h-3.5' />
    );
  };

  return (
    <div className='bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-4'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Filter className='w-4 h-4 text-[#101828]' />
          <span className='text-sm text-[#101828]'>Sort by:</span>
        </div>
        <div className='flex items-center gap-2'>
          {filters.map(filter => (
            <Button
              key={filter.key}
              size='sm'
              variant={activeFilter === filter.key ? 'solid' : 'bordered'}
              color={activeFilter === filter.key ? 'default' : 'default'}
              className={
                activeFilter === filter.key
                  ? 'bg-[#101828] text-white'
                  : 'bg-white border-[rgba(0,0,0,0.1)] text-neutral-950'
              }
              onPress={() => onFilterChange(filter.key)}
            >
              <span className='flex items-center gap-1'>
                {filter.label}
                {getSortIcon(filter.key)}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskSort;
