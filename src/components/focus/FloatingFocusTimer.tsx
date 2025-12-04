'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Clock, ChevronDown, ChevronUp, X } from 'lucide-react';
import { differenceInSeconds } from 'date-fns';
import { useTimerSettings } from '@/hooks';
import { getActiveTimerSession } from '@/services';
import type { TimerSession } from '@/types';

type TimerMode = TimerSession['type'];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
};

export const FloatingFocusTimer: React.FC = () => {
  const pathname = usePathname();
  const { settings: timerSettings } = useTimerSettings();

  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSession, setActiveSession] = useState<TimerSession | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const isOnFocusPage = pathname === '/session';

  const label = useMemo(() => {
    if (!activeSession) return null;

    if (activeSession.type === 'focus') return '🎯 Focus Time';
    if (activeSession.type === 'break') return '☕ Short Break';
    return '🌴 Long Break';
  }, [activeSession]);

  // Fetch active timer session when component mounts or settings change
  useEffect(() => {
    if (isOnFocusPage) return;

    let isMounted = true;

    const fetchActiveSession = async () => {
      const session = await getActiveTimerSession();

      if (!isMounted) return;

      if (!session || session.status !== 'active') {
        setActiveSession(null);
        setRemainingSeconds(null);
        return;
      }

      const sessionType = session.type as TimerMode;
      const totalDurationSeconds = timerSettings[sessionType] * 60;
      const startTime = new Date(session.startTime);
      const elapsedSeconds = differenceInSeconds(new Date(), startTime);

      const remaining = Math.max(0, totalDurationSeconds - elapsedSeconds);

      setActiveSession(session);
      setRemainingSeconds(remaining);
    };

    fetchActiveSession();

    return () => {
      isMounted = false;
    };
  }, [isOnFocusPage, timerSettings]);

  // Countdown effect
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;
    if (isOnFocusPage) return;

    const intervalId = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingSeconds, isOnFocusPage]);

  // Hide card if:
  // - user is on focus page
  // - no active session
  // - timer finished
  // - user manually closed it
  if (
    isOnFocusPage ||
    !isVisible ||
    !activeSession ||
    remainingSeconds === null ||
    remainingSeconds <= 0
  ) {
    return null;
  }

  const displayTime = formatTime(remainingSeconds);

  return (
    <div className='fixed bottom-4 right-4 z-40'>
      <div
        className={`bg-blue-50 border-2 border-[#bedbff] rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden ${
          isCollapsed ? 'w-[200px]' : 'w-[140px]'
        }`}
      >
        {/* Header / Collapsed state */}
        <div
          className={`flex items-center justify-between px-2 ${
            isCollapsed ? 'h-10' : 'h-10 border-b border-[rgba(28,57,142,0.1)]'
          }`}
        >
          <button
            type='button'
            className='flex items-center gap-2 text-xs text-[#1c398e]'
            aria-label='Toggle floating focus timer'
            onClick={() => setIsCollapsed(prev => !prev)}
          >
            <Clock className='w-3.5 h-3.5' />
            {isCollapsed && <span className='text-sm'>{displayTime}</span>}
            {isCollapsed ? (
              <ChevronUp className='w-3 h-3' />
            ) : (
              <ChevronDown className='w-3 h-3' />
            )}
          </button>
          <button
            type='button'
            className='p-1 rounded-full hover:bg-blue-100 text-[#1c398e]'
            aria-label='Close timer'
            onClick={() => setIsVisible(false)}
          >
            <X className='w-3.5 h-3.5' />
          </button>
        </div>

        {/* Expanded body (original card) */}
        {!isCollapsed && (
          <div className='py-3 px-3 text-center'>
            <p className='text-[24px] leading-8 text-[#1c398e]'>
              {displayTime}
            </p>
            {label && (
              <p className='mt-1 text-[11px] leading-4 text-[#1c398e] opacity-70'>
                {label}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
