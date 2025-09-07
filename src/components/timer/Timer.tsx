'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tab, Tabs } from '@heroui/react';
import { RotateCcw, Settings } from 'lucide-react';
import { formatTime, toSeconds } from '@/utils';
import { TimerMode, TimerProps, PomoContainerProps } from './Timer.types';

export const Timer: React.FC<TimerProps> = () => {
  const defaultTime = useMemo(() => {
    return {
      focus: {
        minutes: 25,
        seconds: 0,
      },
      break: {
        minutes: 5,
        seconds: 0,
      },
      rest: {
        minutes: 15,
        seconds: 0,
      },
    };
  }, []);
  // States
  const [activeMode, setActiveMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(
    toSeconds({
      minutes: defaultTime[activeMode].minutes,
      seconds: defaultTime[activeMode].seconds,
    })
  );
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const toggleSession = () => {
    setIsRunning(prev => {
      const next = !prev;
      if (next && !startedAt) setStartedAt(Date.now());
      return next;
    });
  };

  const resetToModeDefault = useCallback(
    (mode: TimerMode) => {
      const minutes = defaultTime[mode].minutes;
      const seconds = defaultTime[mode].seconds;
      setRemainingTime(toSeconds({ minutes, seconds }));
    },
    [defaultTime]
  );

  const handleTabChange = useCallback(
    (key: React.Key) => {
      const mode = String(key) as TimerMode;
      setActiveMode(mode);
      setIsRunning(false);
      resetToModeDefault(mode);
    },
    [resetToModeDefault]
  );

  // Start timer when button is pressed
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  // Reset to default time when timer reaches 0 and change mode
  useEffect(() => {
    if (remainingTime !== 0) return;

    setIsRunning(false);

    const nextMode = activeMode === 'focus' ? 'break' : 'focus';
    setActiveMode(nextMode);
    resetToModeDefault(nextMode);
  }, [activeMode, remainingTime, resetToModeDefault]);

  // Compute what to display for the active tab
  const displayMinutes = Math.floor(remainingTime / 60);
  const displaySeconds = remainingTime % 60;

  return (
    <div className='flex flex-col items-start rounded-2xl border border-black/5 bg-white/70 shadow-lg backdrop-blur px-2 pt-2'>
      <Tabs
        aria-label='Timer Tabs'
        fullWidth={true}
        color='primary'
        variant='solid'
        radius='lg'
        size='lg'
        selectedKey={activeMode}
        onSelectionChange={handleTabChange}
      >
        {Object.entries(defaultTime).map(([key, value]) => (
          <Tab
            key={key}
            className='text-base p-2'
            title={key[0].toUpperCase() + key.slice(1)}
          >
            <PomoContainer
              minutes={key === activeMode ? displayMinutes : value.minutes}
              seconds={key === activeMode ? displaySeconds : value.seconds}
              onPress={toggleSession}
              onReset={() => resetToModeDefault(activeMode)}
              isRunning={key === activeMode && isRunning}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

const PomoContainer: React.FC<PomoContainerProps> = ({ ...props }) => {
  const formattedSeconds = formatTime(props.seconds);
  const formattedMinutes = formatTime(props.minutes);
  const formattedHours = props.hours ? formatTime(props.hours) : '';
  return (
    <div className='self-stretch px-8 py-10 flex flex-col justify-center items-center gap-8'>
      {/* Timer */}
      <div className='flex items-end gap-3 select-none'>
        {/* Display hours */}
        {props.hours && (
          <span className='text-5xl md:text-6xl font-semibold tabular-nums leading-none text-gray-500'>
            {formattedHours}
          </span>
        )}
        {/* Display minutes */}
        <span className='text-[64px] md:text-[88px] font-semibold tabular-nums leading-none'>
          {formattedMinutes}
        </span>
        {/* Display seconds */}
        <span className='text-[64px] md:text-[88px] font-semibold tabular-nums leading-none text-gray-400 animate-pulse'>
          :
        </span>
        <span className='text-[64px] md:text-[88px] font-semibold tabular-nums leading-none'>
          {formattedSeconds}
        </span>
      </div>

      {/* Buttons */}
      <div className='flex items-center gap-3'>
        <Button
          isIconOnly
          variant='light'
          aria-label='Reset timer'
          radius='full'
          onPress={props.onReset}
        >
          <RotateCcw size={22} />
        </Button>
        <Button
          color='primary'
          size='lg'
          className='px-6 shadow-lg shadow-primary/20'
          radius='md'
          onPress={props.onPress ?? undefined}
        >
          {props.isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          isIconOnly
          variant='light'
          aria-label='Timer settings'
          radius='full'
        >
          <Settings size={22} />
        </Button>
      </div>
    </div>
  );
};
