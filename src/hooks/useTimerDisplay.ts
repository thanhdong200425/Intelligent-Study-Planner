'use client';

import { useMemo } from 'react';
import { formatTime, toSeconds, fromSeconds } from '@/utils';

type TimerMode = 'focus' | 'break' | 'long_break';

interface TimerSettings {
  focus: number;
  break: number;
  long_break: number;
}

interface UseTimerDisplayParams {
  remainingTime: number;
  timerSettings: TimerSettings;
  activeMode: TimerMode;
  darkMode: boolean;
  isRunning: boolean;
}

interface UseTimerDisplayReturn {
  displayMinutes: string;
  displaySeconds: string;
  progress: number;
  strokeDashoffset: number;
  circumference: number;
  isDarkModeActive: boolean;
}

export const useTimerDisplay = ({
  remainingTime,
  timerSettings,
  activeMode,
  darkMode,
  isRunning,
}: UseTimerDisplayParams): UseTimerDisplayReturn => {
  const {
    displayMinutes,
    displaySeconds,
    progress,
    strokeDashoffset,
    circumference,
  } = useMemo(() => {
    // Calculate total time for the active mode
    const totalTime = toSeconds({
      minutes: timerSettings[activeMode],
      seconds: 0,
    });

    // Calculate progress percentage for circular timer
    const progress = ((totalTime - remainingTime) / totalTime) * 100;
    const circumference = 2 * Math.PI * 100; // radius = 100
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Format time for display
    const { minutes, seconds } = fromSeconds(remainingTime);
    const displayMinutes = String(formatTime(minutes));
    const displaySeconds = String(formatTime(seconds));

    return {
      displayMinutes,
      displaySeconds,
      progress,
      strokeDashoffset,
      circumference,
    };
  }, [remainingTime, timerSettings, activeMode]);

  const isDarkModeActive = darkMode && isRunning;

  return {
    displayMinutes,
    displaySeconds,
    progress,
    strokeDashoffset,
    circumference,
    isDarkModeActive,
  };
};
