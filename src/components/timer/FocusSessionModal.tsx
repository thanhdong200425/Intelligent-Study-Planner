'use client';

import React from 'react';
import { TimeBlock, Task, Course } from '@/types';
import { Button } from '@/components/ui/Button';
import { Clock, X } from 'lucide-react';

interface FocusSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: () => void;
  timeBlock?: TimeBlock;
  task?: Task;
  course?: Course;
}

export const FocusSessionModal: React.FC<FocusSessionModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
  timeBlock,
  task,
  course,
}) => {
  if (!isOpen) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Start Focus Session
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {timeBlock && (
          <div className='mb-6'>
            <div className='flex items-center gap-2 mb-3'>
              <Clock className='w-5 h-5 text-blue-600' />
              <span className='font-medium text-gray-900'>
                {timeBlock.isBreak ? 'Break Session' : 'Study Session'}
              </span>
            </div>

            {!timeBlock.isBreak && task && (
              <div className='space-y-2'>
                <div>
                  <span className='text-sm text-gray-500'>Task:</span>
                  <p className='font-medium text-gray-900'>{task.title}</p>
                </div>
                {course && (
                  <div>
                    <span className='text-sm text-gray-500'>Course:</span>
                    <p className='text-gray-700'>{course.name}</p>
                  </div>
                )}
                <div>
                  <span className='text-sm text-gray-500'>Duration:</span>
                  <p className='text-gray-700'>
                    {formatDuration(
                      Math.ceil(
                        (new Date(timeBlock.endTime).getTime() -
                          new Date(timeBlock.startTime).getTime()) /
                          (1000 * 60)
                      )
                    )}
                  </p>
                </div>
              </div>
            )}

            {timeBlock.isBreak && (
              <div>
                <span className='text-sm text-gray-500'>Duration:</span>
                <p className='text-gray-700'>
                  {formatDuration(
                    Math.ceil(
                      (new Date(timeBlock.endTime).getTime() -
                        new Date(timeBlock.startTime).getTime()) /
                        (1000 * 60)
                    )
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        <div className='flex gap-3'>
          <Button variant='secondary' onClick={onClose} className='flex-1'>
            Cancel
          </Button>
          <Button variant='primary' onClick={onStartSession} className='flex-1'>
            Start Session
          </Button>
        </div>
      </div>
    </div>
  );
};
