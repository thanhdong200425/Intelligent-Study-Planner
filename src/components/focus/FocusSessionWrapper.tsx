'use client';

import React, { useState } from 'react';
import { FocusTimer } from './FocusTimer';
import SessionHistory from './SessionHistory';
import { TodayTasksSidebar } from './TodayTasksSidebar';
import type { Task } from '@/types';

const FocusSessionWrapper: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <div className='flex flex-col lg:flex-row gap-6 items-start'>
        {/* Timer Section (left) */}
        <div className='flex-1 min-w-0'>
          <FocusTimer selectedTask={selectedTask} />
        </div>

        {/* Today Tasks Sidebar (right) */}
        <TodayTasksSidebar
          selectedTaskId={selectedTask?.id}
          onSelectTask={task =>
            selectedTask?.id === task.id
              ? setSelectedTask(null)
              : setSelectedTask(task)
          }
        />
      </div>

      {/* Session History Section */}
      <SessionHistory />
    </div>
  );
};

export default FocusSessionWrapper;
