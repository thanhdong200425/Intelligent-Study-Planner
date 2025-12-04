'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { RotateCcw, Settings, Play, Pause, Square } from 'lucide-react';
import { toSeconds } from '@/utils';
import { playTimerEndSound } from '@/utils/sounds';
import { differenceInMinutes } from 'date-fns';
import { FocusStats } from './FocusStats';
import {
  useCreateTimerSessionMutation,
  useUpdateTimerSessionMutation,
} from '@/mutations';
import FocusSettingsModal from './FocusSettingsModal';
import {
  useTimerSettings,
  useTimerPreferences,
  useTimerDisplay,
  useAmbientSound,
  useAmbientPreset,
} from '@/hooks';
import type { Task } from '@/types';

type TimerMode = 'focus' | 'break' | 'long_break';

interface FocusTimerProps {
  selectedTask: Task | null;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ selectedTask }) => {
  const { settings: timerSettings, updateSettings } = useTimerSettings();
  const { preferences, updatePreferences } = useTimerPreferences();
  const { selectedPreset: selectedAmbientPreset } = useAmbientPreset();

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [activeMode, setActiveMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(
    toSeconds({
      minutes: timerSettings[activeMode],
      seconds: 0,
    })
  );

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0); // in seconds
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentTimerSessionId, setCurrentTimerSessionId] = useState<
    number | null
  >(null);

  // Play ambient sound only when timer is running
  useAmbientSound(selectedAmbientPreset, isRunning);

  const { mutate: createTimerSession } = useCreateTimerSessionMutation({
    onSuccess: (id: number) => {
      setCurrentTimerSessionId(id);
    },
  });
  const { mutate: updateTimerSession } = useUpdateTimerSessionMutation({});

  const resetToModeDefault = useCallback(
    (mode: TimerMode) => {
      const minutes = timerSettings[mode];
      const seconds = 0;
      setRemainingTime(toSeconds({ minutes, seconds }));
    },
    [timerSettings]
  );

  const toggleSession = useCallback(() => {
    if (!isRunning) {
      const sessionStartTime = new Date();
      setStartTime(sessionStartTime);
      createTimerSession({
        type: activeMode,
        taskId:
          activeMode === 'focus' && selectedTask?.id
            ? Number(selectedTask.id)
            : null,
        timeBlockId: null,
        startTime: sessionStartTime.toISOString(),
      });
    }

    setIsRunning(prev => {
      const next = !prev;
      if (next && !startedAt) {
        setStartedAt(Date.now());
      }
      return next;
    });
  }, [activeMode, createTimerSession, isRunning, selectedTask?.id, startedAt]);

  const handleReset = () => {
    setIsRunning(false);
    setStartedAt(null);
    setStartTime(null);
    resetToModeDefault(activeMode);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStartedAt(null);

    // Calculate and update actual minutes if session was running
    if (currentTimerSessionId && startTime) {
      const endTime = new Date();
      const durationMinutes = differenceInMinutes(endTime, startTime);

      updateTimerSession({
        id: currentTimerSessionId,
        data: {
          endTime: endTime.toISOString(),
          durationMinutes,
        },
      });
    }

    setStartTime(null);
  };

  const handleModeChange = (mode: TimerMode) => {
    if (isRunning) {
      setIsRunning(false);
    }
    setActiveMode(mode);
    resetToModeDefault(mode);
  };

  // Reset timer when durations change
  useEffect(() => {
    if (!isRunning) {
      resetToModeDefault(activeMode);
    }
  }, [timerSettings, activeMode, isRunning, resetToModeDefault]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);

          // Play sound when timer ends (if enabled)
          if (preferences.timerSounds) {
            playTimerEndSound();
          }

          // Track completion
          if (activeMode === 'focus') {
            // Calculate actual minutes based on startTime and endTime
            const endTime = new Date();
            const durationMinutes = startTime
              ? differenceInMinutes(endTime, startTime)
              : 0;

            // Update timer session end time and actual minutes
            if (currentTimerSessionId) {
              updateTimerSession({
                id: currentTimerSessionId,
                data: {
                  endTime: endTime.toISOString(),
                  durationMinutes,
                },
              });
            }

            setCompletedSessions(prev => prev + 1);
            const sessionDuration = timerSettings.focus * 60;
            setTotalFocusTime(prev => prev + sessionDuration);
            setStartTime(null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isRunning,
    activeMode,
    timerSettings.focus,
    preferences.timerSounds,
    currentTimerSessionId,
    startTime,
  ]);

  // Calculate timer display values and progress
  const {
    displayMinutes,
    displaySeconds,
    strokeDashoffset,
    circumference,
    isDarkModeActive,
  } = useTimerDisplay({
    remainingTime,
    timerSettings,
    activeMode,
    darkMode: preferences.darkMode,
    isRunning,
  });

  // If dark mode is active, render full-screen black overlay
  if (isDarkModeActive) {
    return (
      <div className='fixed inset-0 bg-black z-50 flex flex-col items-center justify-center'>
        {/* Circular Timer */}
        <div className='flex justify-center items-center mb-8'>
          <div className='relative w-64 h-64'>
            {/* SVG Circle for Progress */}
            <svg className='transform -rotate-90 w-64 h-64'>
              <circle
                cx='128'
                cy='128'
                r='100'
                stroke='#374151'
                strokeWidth='8'
                fill='none'
              />
              <circle
                cx='128'
                cy='128'
                r='100'
                stroke='#ffffff'
                strokeWidth='8'
                fill='none'
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
                className='transition-all duration-1000'
              />
            </svg>

            {/* Timer Display */}
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <div className='text-[48px] font-normal text-white mb-2 tabular-nums'>
                {displayMinutes}:{displaySeconds}
              </div>
              <div className='text-sm text-gray-400'>
                {activeMode === 'focus'
                  ? '🎯 Focus Time'
                  : activeMode === 'break'
                    ? '☕ Short Break'
                    : '🌴 Long Break'}
              </div>
            </div>
          </div>
        </div>

        {/* Stop Button */}
        <div className='flex items-center justify-center'>
          <Button
            color='danger'
            size='lg'
            radius='lg'
            className='bg-red-600 text-white px-6 h-10'
            startContent={<Square className='w-4 h-4' />}
            onPress={handleStop}
          >
            Stop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-100 rounded-2xl p-8'>
      {/* Selected task info */}
      <div className='bg-gray-50 border border-gray-200 rounded-[14px] p-4 mb-6'>
        <p className='text-sm text-[#4a5565] mb-1'>Focusing on:</p>
        {selectedTask ? (
          <>
            <p className='text-base text-[#101828] mb-3'>
              {selectedTask.title}
            </p>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='inline-flex items-center justify-center rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-0.5 text-xs text-neutral-950'>
                {/* Simple mirror of task type emoji/label */}
                {selectedTask.type === 'reading'
                  ? '📖 Reading'
                  : selectedTask.type === 'coding'
                    ? '💻 Coding'
                    : selectedTask.type === 'writing'
                      ? '✍️ Writing'
                      : selectedTask.type === 'pset'
                        ? '📝 Pset'
                        : '📋 Task'}
              </span>
              {selectedTask.priority && (
                <span className='inline-flex items-center justify-center rounded-lg border px-2 py-0.5 text-xs bg-[#fef9c2] border-[#fff085] text-[#a65f00]'>
                  {selectedTask.priority === 'high'
                    ? 'High'
                    : selectedTask.priority === 'medium'
                      ? 'Medium'
                      : selectedTask.priority === 'low'
                        ? 'Low'
                        : 'Priority'}
                </span>
              )}
              {selectedTask.course && (
                <span className='inline-flex items-center justify-center rounded-lg border border-[rgba(0,0,0,0.1)] px-2 py-0.5 text-xs text-neutral-950'>
                  {selectedTask.course.name}
                </span>
              )}
            </div>
          </>
        ) : (
          <p className='text-sm text-gray-500'>
            No task selected. Choose a task from the sidebar to focus on.
          </p>
        )}
      </div>
      {/* Mode Tabs and Settings - Hide in dark mode when running */}
      {!isDarkModeActive && (
        <div className='relative flex items-center mb-8'>
          {/* Centered Mode Tabs */}
          <div className='flex items-center justify-center gap-2 flex-1'>
            <button
              onClick={() => handleModeChange('focus')}
              className={`px-4 py-2 rounded-lg text-base font-normal transition-colors ${
                activeMode === 'focus'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => handleModeChange('break')}
              className={`px-4 py-2 rounded-lg text-base font-normal transition-colors ${
                activeMode === 'break'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => handleModeChange('long_break')}
              className={`px-4 py-2 rounded-lg text-base font-normal transition-colors ${
                activeMode === 'long_break'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Long Break
            </button>
          </div>
          {/* Settings Icon - Positioned on the right */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className='absolute right-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
            aria-label='Settings'
          >
            <Settings className='w-4 h-4 text-gray-600' />
          </button>
        </div>
      )}

      {/* Circular Timer */}
      <div className='flex justify-center items-center mb-8'>
        <div className='relative w-64 h-64'>
          {/* SVG Circle for Progress */}
          <svg className='transform -rotate-90 w-64 h-64'>
            <circle
              cx='128'
              cy='128'
              r='100'
              stroke={isDarkModeActive ? '#374151' : '#e5e7eb'}
              strokeWidth='8'
              fill='none'
            />
            <circle
              cx='128'
              cy='128'
              r='100'
              stroke={isDarkModeActive ? '#ffffff' : '#101828'}
              strokeWidth='8'
              fill='none'
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
              className='transition-all duration-1000'
            />
          </svg>

          {/* Timer Display */}
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <div
              className={`text-[48px] font-normal mb-2 tabular-nums ${
                isDarkModeActive ? 'text-white' : 'text-gray-900'
              }`}
            >
              {displayMinutes}:{displaySeconds}
            </div>
            <div
              className={`text-sm ${
                isDarkModeActive ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {activeMode === 'focus'
                ? '🎯 Focus Time'
                : activeMode === 'break'
                  ? '☕ Short Break'
                  : '🌴 Long Break'}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className='flex items-center justify-center gap-4 mb-8'>
        {isDarkModeActive ? (
          <Button
            color='danger'
            size='lg'
            radius='lg'
            className='bg-red-600 text-white px-6 h-10'
            startContent={<Square className='w-4 h-4' />}
            onPress={handleStop}
          >
            Stop
          </Button>
        ) : (
          <>
            <Button
              color='primary'
              size='lg'
              radius='lg'
              className='bg-black text-white px-6 h-10'
              startContent={
                isRunning ? (
                  <Pause className='w-4 h-4' />
                ) : (
                  <Play className='w-4 h-4' />
                )
              }
              onPress={toggleSession}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              isIconOnly
              variant='bordered'
              radius='lg'
              className='border-gray-200 w-10 h-10'
              onPress={handleReset}
            >
              <RotateCcw className='w-4 h-4' />
            </Button>
          </>
        )}
      </div>

      {/* Stats - Hide in dark mode when running */}
      {!isDarkModeActive && (
        <FocusStats
          sessionsToday={completedSessions}
          timeFocused={totalFocusTime}
          cyclesComplete={Math.floor(completedSessions / 4)} // Assuming 4 focus sessions = 1 cycle
        />
      )}

      {/* Settings Modal */}
      <FocusSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        timerDurations={timerSettings}
        onTimerDurationsChange={updateSettings}
        preferences={preferences}
        onPreferencesChange={updatePreferences}
      />
    </div>
  );
};
