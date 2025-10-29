'use client';

import React from 'react';
import { TimeBlock, Task, Course } from '@/types';
import { useDraggable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { Clock, Coffee, X, Play } from 'lucide-react';

interface CalendarTimeBlockProps {
  timeBlock: TimeBlock;
  task?: Task;
  course?: Course;
  onDelete: () => void;
  onStartTimer?: () => void;
  onRightClick?: (event: React.MouseEvent) => void;
  onClick?: () => void;
}

const CalendarTimeBlock: React.FC<CalendarTimeBlockProps> = ({
  timeBlock,
  task,
  course,
  onDelete,
  onStartTimer,
  onRightClick,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: timeBlock.id,
    });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      zIndex: isDragging ? 1000 : 1,
    }
    : {};

  const duration = Math.round(
    (timeBlock?.endTime?.getTime() - timeBlock?.startTime?.getTime()) /
    (1000 * 60)
  );
  const startTime = format(timeBlock.startTime, 'HH:mm');
  const endTime = format(timeBlock.endTime, 'HH:mm');

  if (timeBlock.isBreak) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onContextMenu={onRightClick}
        className={`absolute inset-x-0 bg-green-100 border border-green-300 rounded-sm p-1 cursor-move group ${isDragging ? 'opacity-50' : ''
          }`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <Coffee className='w-3 h-3 text-green-600' />
            <span className='text-xs font-medium text-green-700'>
              {timeBlock.breakType === 'long' ? 'Long Break' : 'Short Break'}
            </span>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            className='opacity-0 group-hover:opacity-100 p-0.5 hover:bg-green-200 rounded'
          >
            <X className='w-3 h-3 text-green-600' />
          </button>
        </div>
        <div className='text-xs text-green-600'>
          {startTime} - {endTime} ({duration}m)
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onContextMenu={onRightClick}
        className={`absolute inset-x-0 bg-gray-100 border border-gray-300 rounded-sm p-1 cursor-move group ${isDragging ? 'opacity-50' : ''
          }`}
      >
        <div className='flex items-center justify-between'>
          <span className='text-xs font-medium text-gray-700'>
            Unknown Task
          </span>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            className='opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded'
          >
            <X className='w-3 h-3 text-gray-600' />
          </button>
        </div>
        <div className='text-xs text-gray-600'>
          {startTime} - {endTime} ({duration}m)
        </div>
      </div>
    );
  }

  const backgroundColor = course?.color ? `${course.color}20` : '#f3f4f6';
  const borderColor = course?.color || '#d1d5db';
  const textColor = course?.color || '#374151';

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor,
        borderColor,
      }}
      {...listeners}
      {...attributes}
      onContextMenu={onRightClick}
      onClick={onClick}
      className={`absolute inset-x-0 border rounded-sm p-1 cursor-move group ${isDragging ? 'opacity-50' : ''
        } ${timeBlock.completed ? 'opacity-75' : ''}`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex-1 min-w-0'>
          <div
            className='text-xs font-medium truncate'
            style={{ color: textColor }}
          >
            {task.title}
          </div>
          {course && (
            <div
              className='text-xs opacity-75 truncate'
              style={{ color: textColor }}
            >
              {course.name}
            </div>
          )}
        </div>

        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100'>
          {onStartTimer && !timeBlock.completed && (
            <button
              onClick={e => {
                e.stopPropagation();
                onStartTimer();
              }}
              className='p-0.5 hover:bg-white hover:bg-opacity-50 rounded'
              title='Start Timer'
            >
              <Play className='w-3 h-3' style={{ color: textColor }} />
            </button>
          )}
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            className='p-0.5 hover:bg-white hover:bg-opacity-50 rounded'
            title='Delete Block'
          >
            <X className='w-3 h-3' style={{ color: textColor }} />
          </button>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <div className='text-xs opacity-75' style={{ color: textColor }}>
          {startTime} - {endTime}
        </div>
        <div className='flex items-center gap-1'>
          <Clock className='w-3 h-3 opacity-75' style={{ color: textColor }} />
          <span className='text-xs opacity-75' style={{ color: textColor }}>
            {duration}m
          </span>
        </div>
        {timeBlock.actualMinutes && (
          <div className='text-xs opacity-75' style={{ color: textColor }}>
            (actual: {timeBlock.actualMinutes}m)
          </div>
        )}
        {timeBlock.completed && (
          <div className='text-xs font-medium' style={{ color: textColor }}>
            ✓
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarTimeBlock;