'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TimeBlock, TimerSession, Task, Course } from '@/types';
import { TimerSessionStorage, TimeBlockStorage, TaskStorage, CourseStorage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TimerProps {
  timeBlock?: TimeBlock;
  onComplete?: (actualMinutes: number) => void;
  onCancel?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ timeBlock, onComplete, onCancel }) => {
  const [activeSession, setActiveSession] = useState<TimerSession | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [task, setTask] = useState<Task | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Load existing active session
    const existingSession = TimerSessionStorage.getActive();
    if (existingSession) {
      setActiveSession(existingSession);
      const elapsed = Math.floor((Date.now() - new Date(existingSession.startTime).getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }
  }, []);

  useEffect(() => {
    if (timeBlock && timeBlock.taskId) {
      const taskData = TaskStorage.getAll().find(t => t.id === timeBlock.taskId);
      const courseData = taskData ? CourseStorage.getAll().find(c => c.id === taskData.courseId) : null;
      setTask(taskData || null);
      setCourse(courseData || null);
    }
  }, [timeBlock]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeSession?.isActive) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(activeSession.startTime).getTime()) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const startTimer = useCallback(() => {
    if (!timeBlock) return;

    const session: TimerSession = {
      id: uuidv4(),
      timeBlockId: timeBlock.id,
      startTime: new Date(),
      isActive: true,
      actualMinutes: 0,
    };

    TimerSessionStorage.add(session);
    setActiveSession(session);
    setElapsedSeconds(0);
  }, [timeBlock]);

  const pauseTimer = useCallback(() => {
    if (!activeSession) return;

    const updatedSession: TimerSession = {
      ...activeSession,
      isActive: false,
      actualMinutes: Math.floor(elapsedSeconds / 60),
    };

    TimerSessionStorage.update(updatedSession);
    setActiveSession(updatedSession);
  }, [activeSession, elapsedSeconds]);

  const resumeTimer = useCallback(() => {
    if (!activeSession) return;

    const updatedSession: TimerSession = {
      ...activeSession,
      isActive: true,
      startTime: new Date(Date.now() - elapsedSeconds * 1000),
    };

    TimerSessionStorage.update(updatedSession);
    setActiveSession(updatedSession);
  }, [activeSession, elapsedSeconds]);

  const stopTimer = useCallback(() => {
    if (!activeSession || !timeBlock) return;

    const actualMinutes = Math.floor(elapsedSeconds / 60);
    
    // Update session
    const completedSession: TimerSession = {
      ...activeSession,
      endTime: new Date(),
      isActive: false,
      actualMinutes,
    };
    TimerSessionStorage.update(completedSession);

    // Update time block
    const updatedTimeBlock: TimeBlock = {
      ...timeBlock,
      actualMinutes,
      completed: true,
    };
    TimeBlockStorage.update(updatedTimeBlock);

    // Update task if it exists
    if (task) {
      const updatedTask = {
        ...task,
        actualMinutes: (task.actualMinutes || 0) + actualMinutes,
        completed: actualMinutes >= (timeBlock.endTime.getTime() - timeBlock.startTime.getTime()) / (1000 * 60) * 0.8, // 80% completion threshold
      };
      TaskStorage.update(updatedTask);
    }

    setActiveSession(null);
    setElapsedSeconds(0);
    onComplete?.(actualMinutes);
  }, [activeSession, timeBlock, task, elapsedSeconds, onComplete]);

  const cancelTimer = useCallback(() => {
    if (activeSession) {
      TimerSessionStorage.remove(activeSession.id);
    }
    setActiveSession(null);
    setElapsedSeconds(0);
    onCancel?.();
  }, [activeSession, onCancel]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!timeBlock) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Select a time block to start timing</p>
      </div>
    );
  }

  const estimatedMinutes = Math.floor((timeBlock.endTime.getTime() - timeBlock.startTime.getTime()) / (1000 * 60));
  const estimatedSeconds = estimatedMinutes * 60;
  const progress = estimatedSeconds > 0 ? Math.min((elapsedSeconds / estimatedSeconds) * 100, 100) : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Task Info */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {timeBlock.isBreak ? `${timeBlock.breakType === 'long' ? 'Long' : 'Short'} Break` : task?.title || 'Unknown Task'}
        </h3>
        {course && (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: course.color }}
            />
            <span className="text-sm text-gray-600">{course.name}</span>
          </div>
        )}
        <div className="text-sm text-gray-500 mt-1">
          {format(timeBlock.startTime, 'HH:mm')} - {format(timeBlock.endTime, 'HH:mm')} 
          ({estimatedMinutes} min planned)
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
          {formatTime(elapsedSeconds)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-sm text-gray-600">
          {Math.floor(elapsedSeconds / 60)} / {estimatedMinutes} minutes
          {progress >= 100 && (
            <span className="ml-2 text-green-600 font-medium">Time completed!</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!activeSession || !activeSession.isActive ? (
          <Button
            onClick={activeSession ? resumeTimer : startTimer}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {activeSession ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button
            onClick={pauseTimer}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </Button>
        )}

        {activeSession && (
          <Button
            onClick={stopTimer}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Complete
          </Button>
        )}

        <Button
          onClick={cancelTimer}
          variant="danger"
          className="flex items-center gap-2"
        >
          Cancel
        </Button>
      </div>

      {/* Session Info */}
      {activeSession && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
          <div>Started: {format(activeSession.startTime, 'HH:mm:ss')}</div>
          {activeSession.endTime && (
            <div>Ended: {format(activeSession.endTime, 'HH:mm:ss')}</div>
          )}
        </div>
      )}
    </div>
  );
};