'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Filter } from 'lucide-react';

export type TaskFilter = 'all' | 'priority' | 'course';

interface TaskFiltersProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'priority', label: 'Priority' },
    { key: 'course', label: 'Course' },
  ];

  return (
    <div className="bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#101828]" />
          <span className="text-sm text-[#101828]">Filter by:</span>
        </div>
        <div className="flex items-center gap-2">
          {filters.map(filter => (
            <Button
              key={filter.key}
              size="sm"
              variant={activeFilter === filter.key ? 'solid' : 'bordered'}
              color={activeFilter === filter.key ? 'default' : 'default'}
              className={
                activeFilter === filter.key
                  ? 'bg-[#101828] text-white'
                  : 'bg-white border-[rgba(0,0,0,0.1)] text-neutral-950'
              }
              onPress={() => onFilterChange(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

