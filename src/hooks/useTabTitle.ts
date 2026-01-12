import { TimerMode } from '@/components/focus/FocusTimer';
import { useEffect, useRef } from 'react';

interface UseTabTitleProps {
  isRunning: boolean;
  remainingTime: number;
  mode: TimerMode;
}

export const useTabTitle = ({
  isRunning,
  remainingTime,
  mode,
}: UseTabTitleProps) => {
  const originalTitle = useRef(document.title);

  useEffect(() => {
    originalTitle.current = document.title;

    // Restore original title when component unmounts because it will be changed by the browser
    return () => {
      document.title = originalTitle.current;
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      document.title = originalTitle.current;
      return;
    }

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = `${formattedTime} - StudyGo`;
  }, [isRunning, remainingTime, mode]);
};
