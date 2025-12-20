'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  Checkbox,
  Button,
} from '@heroui/react';
import { X, Zap, Calendar, Clock } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ExtractedTask, TaskType } from '@/types';
import { useCreateMultipleTasksMutation } from '@/mutations';

interface ExtractedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOver: () => void;
  tasks: ExtractedTask[];
}

const getTaskTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    reading: 'Reading',
    coding: 'Coding',
    writing: 'Writing',
    pset: 'Pset',
    other: 'Other',
  };
  return labels[type] || 'Other';
};

const getPriorityStyles = (priority?: string) => {
  switch (priority) {
    case 'high':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        label: 'High',
      };
    case 'medium':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        label: 'Medium',
      };
    case 'low':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        label: 'Low',
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
        label: 'Medium',
      };
  }
};

const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatDueDate = (dueDate?: string): string => {
  if (!dueDate) return '';
  try {
    const date = parseISO(dueDate);
    const days = differenceInDays(date, new Date());
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `In ${days} days`;
    return format(date, 'MMM d, yyyy');
  } catch {
    return '';
  }
};

const ExtractedTasksModal: React.FC<ExtractedTasksModalProps> = ({
  isOpen,
  onClose,
  onStartOver,
  tasks,
}) => {
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(
    new Set(tasks.map((_, index) => index))
  );
  const [creatingTasks, setCreatingTasks] = useState<Set<number>>(new Set());

  const { mutateAsync: createMultipleTasks } = useCreateMultipleTasksMutation(
    {}
  );

  const handleToggleTask = (index: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTasks(newSelected);
  };

  const handleCreateSelected = async () => {
    const selectedTaskIndexes = Array.from(selectedTasks).filter(
      index => !creatingTasks.has(index)
    );

    const taskToCreate = tasks
      .filter((_, index) => selectedTaskIndexes.includes(index))
      .map(newTask => ({
        title: newTask.title,
        priority: newTask.priority,
        estimateMinutes: newTask.estimateMinutes || 60,
        type: (newTask.type as TaskType) || 'other',
        ...(newTask.description ? { description: newTask.description } : {}),
        ...(newTask.dueDate ? { dueDate: newTask.dueDate } : {}),
      }));
    await createMultipleTasks(taskToCreate);
    onClose();
  };

  const allTasksCreated = selectedTasks.size === 0 && tasks.length > 0;
  const allSelected = selectedTasks.size === tasks.length && tasks.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      classNames={{
        base: 'rounded-[20px]',
        body: 'p-0',
      }}
      hideCloseButton
      scrollBehavior='inside'
    >
      <ModalContent>
        <ModalBody className='p-0'>
          <div className='bg-white border border-[rgba(0,0,0,0.1)] rounded-[20px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]'>
            {/* Header */}
            <div className='border-b border-gray-100 flex h-[61px] items-center justify-between px-6'>
              <h2 className='text-[18px] font-semibold text-[#101828] leading-[24px]'>
                Extracted Tasks
              </h2>
              <button
                onClick={onClose}
                className='opacity-70 hover:opacity-100 transition-opacity'
                aria-label='Close'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Content */}
            <div className='flex flex-col max-h-[600px] overflow-y-auto'>
              {/* Info Banner */}
              <div className='bg-blue-50 border-b border-blue-100 px-6 py-4'>
                <div className='flex gap-3 items-start'>
                  <Zap className='w-5 h-5 text-[#1447e6] shrink-0 mt-0.5' />
                  <p className='text-[14px] text-[#1c398e] leading-[20px]'>
                    AI extracted {tasks.length} task
                    {tasks.length !== 1 ? 's' : ''} from your image. Review the
                    tasks below and select the ones you want to add to your task
                    list.
                  </p>
                </div>
              </div>

              {/* Tasks List */}
              <div className='p-6 space-y-4'>
                {tasks.map((task, index) => {
                  const isSelected = selectedTasks.has(index);
                  const isCreating = creatingTasks.has(index);
                  const priorityStyles = getPriorityStyles(task.priority);

                  return (
                    <div
                      key={index}
                      className='bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] p-4 flex items-start gap-4'
                    >
                      <Checkbox
                        isSelected={isSelected}
                        onValueChange={() => handleToggleTask(index)}
                        className='mt-1'
                        isDisabled={isCreating}
                      />
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-[16px] font-medium text-[#101828] mb-2'>
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className='text-[14px] text-[#6a7282] mb-3 line-clamp-2'>
                            {task.description}
                          </p>
                        )}

                        <div className='flex flex-wrap items-center gap-2 mb-3'>
                          {task.dueDate && (
                            <span className='inline-flex items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-1 text-xs text-[#364153]'>
                              <Calendar className='w-3 h-3' />
                              {formatDueDate(task.dueDate)}
                            </span>
                          )}

                          {task.priority && (
                            <span
                              className={`inline-flex items-center rounded-lg border px-2 py-1 text-xs ${priorityStyles.bg} ${priorityStyles.border} ${priorityStyles.text}`}
                            >
                              {priorityStyles.label}
                            </span>
                          )}

                          {task.estimateMinutes && (
                            <span className='inline-flex items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-1 text-xs text-[#364153]'>
                              <Clock className='w-3 h-3' />
                              {formatTime(task.estimateMinutes)}
                            </span>
                          )}

                          <span className='inline-flex items-center rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-1 text-xs text-[#6a7282] bg-gray-50'>
                            {getTaskTypeLabel(task.type || 'other')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className='border-t border-gray-100 flex items-center justify-between px-6 py-4'>
              <Button
                variant='light'
                onPress={onStartOver}
                className='text-[#364153]'
              >
                Start Over
              </Button>
              <Button
                onPress={handleCreateSelected}
                isDisabled={selectedTasks.size === 0 || allTasksCreated}
                isLoading={creatingTasks.size > 0}
                color='primary'
              >
                {allSelected
                  ? 'Create All Tasks'
                  : `Create Selected Task${selectedTasks.size !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExtractedTasksModal;
