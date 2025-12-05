'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllTasks } from '@/services';
import { Task, TaskPriority, TaskType } from '@/types';
import { Clock } from 'lucide-react';
import { useToggleCompleteTaskMutation } from '@/mutations';

const getTaskTypeEmoji = (type: TaskType): string => {
  switch (type) {
    case 'reading':
      return '📖';
    case 'coding':
      return '💻';
    case 'writing':
      return '✍️';
    case 'pset':
      return '📝';
    default:
      return '📋';
  }
};
const getTaskTypeLabel = (type: TaskType): string => {
  switch (type) {
    case 'reading':
      return 'Reading';
    case 'coding':
      return 'Coding';
    case 'writing':
      return 'Writing';
    case 'pset':
      return 'Pset';
    default:
      return 'Task';
  }
};

const getPriorityStyles = (priority?: TaskPriority) => {
  switch (priority) {
    case 'high':
      return {
        bg: 'bg-[#ffe2e2]',
        border: 'border-[#ffc9c9]',
        text: 'text-[#c10007]',
        label: 'High',
      };
    case 'medium':
      return {
        bg: 'bg-[#fef9c2]',
        border: 'border-[#fff085]',
        text: 'text-[#a65f00]',
        label: 'Medium',
      };
    case 'low':
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-600',
        label: 'Low',
      };
    default:
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-600',
        label: 'Priority',
      };
  }
};

const formatTime = (minutes?: number): string => {
  if (!minutes) return 'No estimate';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
};

interface TodayTasksSidebarProps {
  selectedTaskId?: string;
  onSelectTask?: (task: Task) => void;
}

export const TodayTasksSidebar: React.FC<TodayTasksSidebarProps> = ({
  selectedTaskId,
  onSelectTask,
}) => {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => getAllTasks({ includeCourse: true }),
  });

  const { mutate: toggleComplete } = useToggleCompleteTaskMutation({});

  const handleToggleComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const taskId = Number(task.id);
    if (!isNaN(taskId)) {
      toggleComplete(taskId);
    }
  };

  const displayedTasks = tasks?.slice(0, 5) ?? [];

  return (
    <aside className='w-full lg:w-80 xl:w-96 shrink-0'>
      <div className='bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 h-full flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-base font-normal text-[#101828]'>Select Task</h2>
          <div className='border border-[rgba(0,0,0,0.1)] rounded-lg px-3 py-0.5 text-xs text-gray-900'>
            {tasks?.length} tasks
          </div>
        </div>

        <div className='space-y-3 overflow-y-auto'>
          {isLoading && (
            <p className='text-sm text-gray-500'>Loading your tasks…</p>
          )}

          {!isLoading && displayedTasks.length === 0 && (
            <p className='text-sm text-gray-500'>
              You don&apos;t have any open tasks for today.
            </p>
          )}

          {!isLoading &&
            displayedTasks.map(task => {
              const priority = getPriorityStyles(task.priority);
              const isSelected = task.id === selectedTaskId;
              const isCompleted = task.completed;
              return (
                <div
                  key={task.id}
                  className={`cursor-pointer bg-gray-50 rounded-[10px] px-3 py-3 transition-all ${
                    isSelected
                      ? 'border-2 border-black'
                      : 'border border-gray-200'
                  } ${isCompleted ? 'opacity-60' : ''}`}
                >
                  <div className='flex gap-3'>
                    <div
                      onClick={e => handleToggleComplete(task, e)}
                      className={`mt-1 h-4 w-4 rounded-sm border shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-colors ${
                        isCompleted
                          ? 'bg-[#030213] border-[#030213] flex items-center justify-center'
                          : 'bg-[#f3f3f5] border-[rgba(0,0,0,0.1)] hover:bg-gray-200'
                      }`}
                    >
                      {isCompleted && (
                        <svg
                          className='w-3 h-3 text-white'
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path d='M5 13l4 4L19 7'></path>
                        </svg>
                      )}
                    </div>
                    <div
                      className='flex-1 min-w-0 space-y-3'
                      onClick={() => onSelectTask?.(task)}
                    >
                      <p
                        className={`text-sm text-[#101828] leading-5 line-clamp-2 ${
                          isCompleted ? 'line-through' : ''
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='inline-flex items-center justify-center rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-0.5 text-xs text-neutral-950'>
                          {getTaskTypeEmoji(task.type)}{' '}
                          {getTaskTypeLabel(task.type)}
                        </span>

                        {task.priority && (
                          <span
                            className={`inline-flex items-center justify-center rounded-lg border px-2 py-0.5 text-xs ${priority.bg} ${priority.border} ${priority.text}`}
                          >
                            {priority.label}
                          </span>
                        )}

                        {/* Display the course name if it exists */}
                        {task.course && (
                          <span className='inline-flex items-center justify-center rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-0.5 text-xs text-neutral-950'>
                            {task.course.name}
                          </span>
                        )}
                      </div>

                      <div className='flex items-center gap-2 text-xs text-[#6a7282]'>
                        <Clock className='w-3 h-3' />
                        <span>{formatTime(task.estimateMinutes)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {!isLoading &&
            tasks?.length &&
            tasks.length > displayedTasks.length && (
              <p className='text-xs text-gray-500'>
                +{tasks.length - displayedTasks.length} more tasks
              </p>
            )}
        </div>
      </div>
    </aside>
  );
};
