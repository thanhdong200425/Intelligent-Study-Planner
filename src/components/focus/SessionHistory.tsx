'use client';

import React, { useMemo } from 'react';
import { Button } from '@heroui/react';
import { Clock } from 'lucide-react';
import { TimerSessionStorage } from '@/lib/storage';
import { TimerSession } from '@/types';

interface SessionItem {
  id: string;
  name: string;
  duration: number; // in minutes
  time: string; // formatted time
  completed: boolean;
  type: 'focus' | 'break';
}

// Mock data for now - will be replaced with actual data from TimerSessionStorage
const mockSessions: SessionItem[] = [
  {
    id: '1',
    name: 'Mathematics',
    duration: 25,
    time: '10:00 AM',
    completed: true,
    type: 'focus',
  },
  {
    id: '2',
    name: 'Break',
    duration: 5,
    time: '10:30 AM',
    completed: true,
    type: 'break',
  },
  {
    id: '3',
    name: 'Physics',
    duration: 25,
    time: '10:40 AM',
    completed: true,
    type: 'focus',
  },
  {
    id: '4',
    name: 'Break',
    duration: 5,
    time: '11:10 AM',
    completed: true,
    type: 'break',
  },
  {
    id: '5',
    name: 'Chemistry',
    duration: 25,
    time: '11:20 AM',
    completed: false,
    type: 'focus',
  },
];

export const SessionHistory: React.FC = () => {
  // Get today's sessions from storage
  const todaySessions = useMemo(() => {
    const allSessions = TimerSessionStorage.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allSessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
  }, []);

  // For now, use mock data. Later, convert TimerSession to SessionItem format
  const sessions = mockSessions;

  const getSessionIcon = (type: 'focus' | 'break') => {
    if (type === 'focus') {
      return (
        <div className='bg-black rounded-[10px] w-10 h-10 flex items-center justify-center shrink-0'>
          <Clock className='w-5 h-5 text-white' />
        </div>
      );
    }
    return (
      <div className='bg-blue-100 rounded-[10px] w-10 h-10 flex items-center justify-center shrink-0'>
        <Clock className='w-5 h-5 text-blue-600' />
      </div>
    );
  };

  return (
    <div className='bg-white border border-gray-100 rounded-2xl p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-base font-normal text-gray-900'>
          Today&apos;s Sessions
        </h2>
        <Button size='sm' radius='lg' className='bg-black text-white h-9'>
          View All
        </Button>
      </div>

      {/* Session List */}
      <div className='flex flex-col gap-3'>
        {sessions.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            No sessions today. Start your first focus session!
          </div>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              className={`flex items-center gap-3 px-[13px] py-1 rounded-[10px] border ${
                session.completed
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-300'
              }`}
            >
              {/* Icon */}
              {getSessionIcon(session.type)}

              {/* Session Info */}
              <div className='flex-1 min-w-0'>
                <div className='text-base font-normal text-gray-900 mb-1'>
                  {session.name}
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Clock className='w-3 h-3 shrink-0' />
                  <span>{session.duration} min</span>
                  <span>•</span>
                  <span>{session.time}</span>
                </div>
              </div>

              {/* Completion Status */}
              {session.completed && (
                <div className='bg-green-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0'>
                  <span className='text-green-600 text-xs'>✓</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
