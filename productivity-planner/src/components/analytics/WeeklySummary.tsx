'use client';

import React, { useState, useEffect } from 'react';
import { WeeklySummary as WeeklySummaryType, TimeBlock, Task, Course, Deadline, Habit, HabitCompletion } from '@/types';
import { 
  TimeBlockStorage, 
  TaskStorage, 
  CourseStorage, 
  DeadlineStorage, 
  HabitStorage, 
  HabitCompletionStorage,
  WeeklySummaryStorage 
} from '@/lib/storage';
import { startOfWeek, endOfWeek, format, isSameWeek, addDays } from 'date-fns';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BookOpen, 
  Zap,
  Award,
  AlertTriangle 
} from 'lucide-react';

interface WeeklySummaryProps {
  weekStart?: Date;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ 
  weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) 
}) => {
  const [summary, setSummary] = useState<WeeklySummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateWeeklySummary();
  }, [weekStart]);

  const generateWeeklySummary = () => {
    setLoading(true);
    
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const timeBlocks = TimeBlockStorage.getByWeek(weekStart);
    const allTasks = TaskStorage.getAll();
    const allCourses = CourseStorage.getAll();
    const allDeadlines = DeadlineStorage.getAll();
    const allHabits = HabitStorage.getAll();
    const allHabitCompletions = HabitCompletionStorage.getAll();

    // Calculate task completion stats
    const weekTasks = allTasks.filter(task => {
      const taskBlocks = timeBlocks.filter(block => block.taskId === task.id);
      return taskBlocks.length > 0;
    });

    const completedTasks = weekTasks.filter(task => task.completed).length;
    const overdueTasks = allDeadlines.filter(deadline => {
      const dueDate = new Date(deadline.dueDate);
      return dueDate < weekEnd && !deadline.completed;
    }).length;

    // Calculate time tracking
    const actualTimeBlocks = timeBlocks.filter(block => block.actualMinutes && !block.isBreak);
    const totalActualTime = actualTimeBlocks.reduce((sum, block) => sum + (block.actualMinutes || 0), 0);
    const totalPredictedTime = timeBlocks
      .filter(block => !block.isBreak)
      .reduce((sum, block) => {
        const duration = (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60);
        return sum + duration;
      }, 0);

    // Calculate time per course
    const timePerCourse: { [courseId: string]: number } = {};
    actualTimeBlocks.forEach(block => {
      const task = allTasks.find(t => t.id === block.taskId);
      if (task) {
        timePerCourse[task.courseId] = (timePerCourse[task.courseId] || 0) + (block.actualMinutes || 0);
      }
    });

    // Calculate habit streaks
    const habitStreaks: { [habitId: string]: number } = {};
    allHabits.forEach(habit => {
      habitStreaks[habit.id] = habit.currentStreak;
    });

    // Find most productive time slot
    const productiveTimeSlot = findMostProductiveTimeSlot(timeBlocks);

    const summaryData: WeeklySummaryType = {
      weekStart,
      weekEnd,
      tasksCompleted: completedTasks,
      tasksOverdue: overdueTasks,
      totalActualTime,
      totalPredictedTime,
      timePerCourse,
      habitStreaks,
      mostProductiveTimeSlot: productiveTimeSlot,
    };

    setSummary(summaryData);
    WeeklySummaryStorage.add(summaryData);
    setLoading(false);
  };

  const findMostProductiveTimeSlot = (timeBlocks: TimeBlock[]) => {
    const timeSlots: { [key: string]: { total: number; actual: number; count: number } } = {};

    timeBlocks
      .filter(block => block.actualMinutes && !block.isBreak)
      .forEach(block => {
        const day = format(block.startTime, 'EEEE');
        const hour = format(block.startTime, 'HH:00');
        const key = `${day} ${hour}`;
        
        if (!timeSlots[key]) {
          timeSlots[key] = { total: 0, actual: 0, count: 0 };
        }
        
        const plannedDuration = (block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60);
        timeSlots[key].total += plannedDuration;
        timeSlots[key].actual += block.actualMinutes || 0;
        timeSlots[key].count += 1;
      });

    let mostProductive = null;
    let highestProductivity = 0;

    Object.entries(timeSlots).forEach(([timeSlot, data]) => {
      if (data.count >= 2) { // At least 2 sessions for statistical significance
        const productivity = data.total > 0 ? (data.actual / data.total) : 0;
        if (productivity > highestProductivity) {
          highestProductivity = productivity;
          const [day, time] = timeSlot.split(' ');
          mostProductive = {
            day,
            timeRange: `${time}-${format(new Date(`2000-01-01 ${time}`).getTime() + 60 * 60 * 1000, 'HH:00')}`,
            productivity: Math.round(productivity * 100),
          };
        }
      }
    });

    return mostProductive;
  };

  const getTimeEfficiency = () => {
    if (!summary || summary.totalPredictedTime === 0) return 0;
    return Math.round((summary.totalActualTime / summary.totalPredictedTime) * 100);
  };

  const getInsight = (): string => {
    if (!summary) return '';

    const efficiency = getTimeEfficiency();
    const habits = Object.values(summary.habitStreaks);
    const avgHabitStreak = habits.length > 0 ? habits.reduce((a, b) => a + b, 0) / habits.length : 0;

    if (summary.mostProductiveTimeSlot) {
      return `You're most productive on ${summary.mostProductiveTimeSlot.day}s at ${summary.mostProductiveTimeSlot.timeRange} (${summary.mostProductiveTimeSlot.productivity}% efficiency)`;
    }

    if (efficiency > 90) {
      return "Excellent time management! You're staying on track with your estimates.";
    }

    if (efficiency < 70) {
      return "Consider breaking tasks into smaller chunks or adjusting your time estimates.";
    }

    if (avgHabitStreak > 5) {
      return `Great job maintaining your habits! Average streak: ${Math.round(avgHabitStreak)} days.`;
    }

    if (summary.tasksOverdue > 3) {
      return "You have several overdue tasks. Consider reprioritizing your schedule.";
    }

    return "Keep up the good work! Consistency is key to productivity.";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No data available for this week</p>
      </div>
    );
  }

  const courses = CourseStorage.getAll();
  const efficiency = getTimeEfficiency();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Summary</h2>
        <p className="text-gray-600">
          {format(summary.weekStart, 'MMM d')} - {format(summary.weekEnd, 'MMM d, yyyy')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-blue-900">{summary.tasksCompleted}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className={`p-4 rounded-lg ${summary.tasksOverdue > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${summary.tasksOverdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                Overdue Tasks
              </p>
              <p className={`text-2xl font-bold ${summary.tasksOverdue > 0 ? 'text-red-900' : 'text-green-900'}`}>
                {summary.tasksOverdue}
              </p>
            </div>
            {summary.tasksOverdue > 0 ? (
              <AlertTriangle className="w-8 h-8 text-red-600" />
            ) : (
              <Award className="w-8 h-8 text-green-600" />
            )}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Time Efficiency</p>
              <p className="text-2xl font-bold text-purple-900">{efficiency}%</p>
            </div>
            {efficiency >= 90 ? (
              <TrendingUp className="w-8 h-8 text-purple-600" />
            ) : (
              <TrendingDown className="w-8 h-8 text-purple-600" />
            )}
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Time Tracked</p>
              <p className="text-2xl font-bold text-orange-900">
                {Math.round(summary.totalActualTime / 60)}h
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Time per Course */}
      {Object.keys(summary.timePerCourse).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Time per Course</h3>
          <div className="space-y-3">
            {Object.entries(summary.timePerCourse)
              .sort(([, a], [, b]) => b - a)
              .map(([courseId, minutes]) => {
                const course = courses.find(c => c.id === courseId);
                const hours = Math.round(minutes / 60 * 10) / 10;
                const percentage = summary.totalActualTime > 0 ? 
                  Math.round((minutes / summary.totalActualTime) * 100) : 0;

                return (
                  <div key={courseId} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: course?.color || '#gray' }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {course?.name || 'Unknown Course'}
                        </span>
                        <span className="text-sm text-gray-600">
                          {hours}h ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: course?.color || '#gray'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Habit Streaks */}
      {Object.keys(summary.habitStreaks).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Habit Streaks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(summary.habitStreaks).map(([habitId, streak]) => {
              const habit = HabitStorage.getAll().find(h => h.id === habitId);
              return (
                <div key={habitId} className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Zap className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-lg font-bold text-gray-900">{streak}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {habit?.name || 'Unknown Habit'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Insight */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <div className="flex items-start">
          <BookOpen className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Weekly Insight</h4>
            <p className="text-gray-700">{getInsight()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};