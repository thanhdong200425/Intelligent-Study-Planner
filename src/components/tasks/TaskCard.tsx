'use client';

import React from 'react';
import { Task, Course, TaskType, TaskPriority } from '@/types';
import { Checkbox, Button, Chip } from '@heroui/react';
import { Clock, MoreVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  course?: Course;
  onToggleComplete: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

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
        label: 'High Priority',
      };
    case 'medium':
      return {
        bg: 'bg-[#fef9c2]',
        border: 'border-[#fff085]',
        text: 'text-[#a65f00]',
        label: 'Medium Priority',
      };
    case 'low':
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-600',
        label: 'Low Priority',
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

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  course,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const priorityStyles = getPriorityStyles(task.priority);
  const courseColor = course?.color || '#3b82f6';

  return (
    <div
      className={`bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Checkbox
            isSelected={task.completed}
            onValueChange={() => onToggleComplete(task)}
            className="mt-1"
            classNames={{
              base: 'min-w-4',
              wrapper: task.completed
                ? 'bg-[#030213] border-[#030213]'
                : 'bg-[#f3f3f5] border-[rgba(0,0,0,0.1)]',
            }}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-normal text-[#101828] mb-2 ${
                task.completed ? 'line-through' : ''
              }`}
            >
              {task.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {/* Task Type Badge */}
              <Chip
                variant="bordered"
                size="sm"
                className="border-[rgba(0,0,0,0.1)] text-xs"
              >
                {getTaskTypeEmoji(task.type)} {getTaskTypeLabel(task.type)}
              </Chip>

              {/* Priority Badge */}
              {task.priority && (
                <Chip
                  variant="bordered"
                  size="sm"
                  className={`${priorityStyles.bg} ${priorityStyles.border} ${priorityStyles.text} text-xs border-[0.8px]`}
                >
                  {priorityStyles.label}
                </Chip>
              )}

              {/* Course Badge */}
              {course && (
                <Chip
                  variant="bordered"
                  size="sm"
                  className="text-xs"
                  style={{
                    borderColor: courseColor,
                    color: courseColor,
                  }}
                  startContent={
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: courseColor }}
                    />
                  }
                >
                  {course.name}
                </Chip>
              )}

              {/* Time Estimate */}
              <div className="flex items-center gap-1 text-xs text-[#4a5565]">
                <Clock className="w-3 h-3" />
                <span>{formatTime(task.estimateMinutes)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* More Options Button */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="min-w-9 h-8"
          onPress={() => {
            // Handle menu actions
            if (onEdit) onEdit(task);
          }}
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

