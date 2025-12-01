'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTodayTimerSessions } from '@/services';
import { TimerSession } from '@/types';

const SessionHistory: React.FC = () => {
  const { data: sessions = [], isLoading } = useQuery<TimerSession[]>({
    queryKey: ['timer-sessions', 'today'],
    queryFn: getTodayTimerSessions,
    refetchInterval: 30000, // Refetch every 30 seconds to keep it updated
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getSessionName = (session: TimerSession) => {
    if (session.type === 'break') return 'Short Break';
    if (session.type === 'long_break') return 'Long Break';
    // For focus sessions, show task title or course name
    if (session.task) {
      return session.task.title;
    }
    return 'Focus Session';
  };

  const getSessionDuration = (session: TimerSession) => {
    if (session.endTime) {
      // Calculate actual duration if session is completed
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
      return minutes;
    }
    return session.actualMinutes || 0;
  };

  const isSessionCompleted = (session: TimerSession) => {
    return !!session.endTime;
  };

  const getSessionIcon = (type: 'focus' | 'break' | 'long_break') => {
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
        {isLoading ? (
          <div className='text-center py-8 text-gray-500'>
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            No sessions today. Start your first focus session!
          </div>
        ) : (
          sessions.map(session => {
            const completed = isSessionCompleted(session);
            const duration = getSessionDuration(session);
            const name = getSessionName(session);
            const time = formatTime(session.startTime);

            return (
              <div
                key={session.id}
                className={`flex items-center gap-3 px-[13px] py-1 rounded-[10px] border ${
                  completed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-300'
                }`}
              >
                {/* Icon */}
                {getSessionIcon(session.type)}

                {/* Session Info */}
                <div className='flex-1 min-w-0'>
                  <div className='text-base font-normal text-gray-900 mb-1'>
                    {name}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Clock className='w-3 h-3 shrink-0' />
                    <span>{duration} min</span>
                    <span>•</span>
                    <span>{time}</span>
                  </div>
                </div>

                {/* Completion Status */}
                {completed && (
                  <div className='bg-green-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0'>
                    <span className='text-green-600 text-xs'>✓</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
