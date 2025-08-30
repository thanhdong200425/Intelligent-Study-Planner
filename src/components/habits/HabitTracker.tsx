'use client';

import React, { useState, useEffect } from 'react';
import { Habit, HabitCompletion } from '@/types';
import { HabitStorage, HabitCompletionStorage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfDay, isToday, subDays, isSameDay } from 'date-fns';
import { Check, Plus, Flame, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface HabitTrackerProps {
  onHabitUpdate?: () => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ onHabitUpdate }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', targetMinutes: 20 });
  const [checkInData, setCheckInData] = useState<{ [habitId: string]: number }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allHabits = HabitStorage.getAll();
    const allCompletions = HabitCompletionStorage.getAll();
    setHabits(allHabits);
    setCompletions(allCompletions);
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: uuidv4(),
      name: newHabit.name.trim(),
      targetMinutes: newHabit.targetMinutes,
      currentStreak: 0,
      longestStreak: 0,
      completions: [],
    };

    HabitStorage.add(habit);
    setNewHabit({ name: '', targetMinutes: 20 });
    setIsAddingHabit(false);
    loadData();
    onHabitUpdate?.();
  };

  const checkInHabit = (habitId: string) => {
    const minutes = checkInData[habitId] || 0;
    if (minutes <= 0) return;

    const today = startOfDay(new Date());
    
    // Check if already completed today
    const existingCompletion = completions.find(c => 
      c.habitId === habitId && isSameDay(new Date(c.date), today)
    );

    if (existingCompletion) {
      // Update existing completion
      const updatedCompletion: HabitCompletion = {
        ...existingCompletion,
        minutes: existingCompletion.minutes + minutes,
      };
      HabitCompletionStorage.update(updatedCompletion);
    } else {
      // Create new completion
      const completion: HabitCompletion = {
        id: uuidv4(),
        habitId,
        date: today,
        minutes,
      };
      HabitCompletionStorage.add(completion);
    }

    // Update habit streaks
    updateHabitStreaks(habitId);
    
    // Clear input
    setCheckInData({ ...checkInData, [habitId]: 0 });
    loadData();
    onHabitUpdate?.();
  };

  const updateHabitStreaks = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const habitCompletions = completions
      .filter(c => c.habitId === habitId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let checkDate = startOfDay(new Date());

    // Calculate current streak
    while (true) {
      const completion = habitCompletions.find(c => 
        isSameDay(new Date(c.date), checkDate) && c.minutes >= habit.targetMinutes
      );
      
      if (completion) {
        if (currentStreak === tempStreak) {
          currentStreak++;
        }
        tempStreak++;
      } else {
        break;
      }
      
      checkDate = subDays(checkDate, 1);
    }

    // Calculate longest streak
    tempStreak = 0;
    checkDate = startOfDay(new Date());
    
    for (let i = 0; i < 365; i++) { // Check last year
      const completion = habitCompletions.find(c => 
        isSameDay(new Date(c.date), checkDate) && c.minutes >= habit.targetMinutes
      );
      
      if (completion) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
      
      checkDate = subDays(checkDate, 1);
    }

    const updatedHabit: Habit = {
      ...habit,
      currentStreak,
      longestStreak,
    };

    HabitStorage.update(updatedHabit);
  };

  const getTodayProgress = (habitId: string): { completed: number; target: number; percentage: number } => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { completed: 0, target: 0, percentage: 0 };

    const today = startOfDay(new Date());
    const todayCompletion = completions.find(c => 
      c.habitId === habitId && isSameDay(new Date(c.date), today)
    );

    const completed = todayCompletion?.minutes || 0;
    const target = habit.targetMinutes;
    const percentage = target > 0 ? Math.min((completed / target) * 100, 100) : 0;

    return { completed, target, percentage };
  };

  const getWeeklyProgress = (habitId: string): number[] => {
    const weekProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(startOfDay(new Date()), i);
      const completion = completions.find(c => 
        c.habitId === habitId && isSameDay(new Date(c.date), date)
      );
      const habit = habits.find(h => h.id === habitId);
      const progress = habit && completion ? 
        Math.min((completion.minutes / habit.targetMinutes) * 100, 100) : 0;
      weekProgress.push(progress);
    }
    return weekProgress;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Habit Tracker</h2>
        <Button
          onClick={() => setIsAddingHabit(true)}
          variant="primary"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Habit
        </Button>
      </div>

      {/* Add Habit Form */}
      {isAddingHabit && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Habit Name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              placeholder="e.g., Review notes, Exercise"
            />
            <Input
              label="Target Minutes"
              type="number"
              min="1"
              value={newHabit.targetMinutes}
              onChange={(e) => setNewHabit({ ...newHabit, targetMinutes: parseInt(e.target.value) || 0 })}
            />
            <div className="flex items-end gap-2">
              <Button onClick={addHabit} variant="primary">Add</Button>
              <Button onClick={() => setIsAddingHabit(false)} variant="secondary">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {habits.map(habit => {
          const todayProgress = getTodayProgress(habit.id);
          const weeklyProgress = getWeeklyProgress(habit.id);
          const isCompleted = todayProgress.percentage >= 100;

          return (
            <div key={habit.id} className="bg-white rounded-lg shadow-md p-6">
              {/* Habit Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
                  <p className="text-sm text-gray-600">{habit.targetMinutes} minutes daily</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Flame className="w-4 h-4" />
                    <span className="font-semibold">{habit.currentStreak}</span>
                  </div>
                  {isCompleted && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Today's Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Today&apos;s Progress</span>
                  <span className="text-sm text-gray-600">
                    {todayProgress.completed} / {todayProgress.target} min
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${todayProgress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">This Week</div>
                <div className="flex gap-1">
                  {weeklyProgress.map((progress, index) => {
                    const date = subDays(new Date(), 6 - index);
                    const isToday = isSameDay(date, new Date());
                    return (
                      <div key={index} className="flex-1">
                        <div 
                          className={`h-8 rounded-sm ${
                            progress >= 100 ? 'bg-green-200' : 
                            progress >= 50 ? 'bg-yellow-200' : 
                            progress > 0 ? 'bg-gray-200' : 'bg-gray-100'
                          } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                          title={`${format(date, 'MMM d')}: ${Math.round(progress)}%`}
                        >
                          <div 
                            className={`h-full rounded-sm ${
                              progress >= 100 ? 'bg-green-500' : 
                              progress >= 50 ? 'bg-yellow-500' : 
                              progress > 0 ? 'bg-gray-400' : ''
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-center mt-1 text-gray-500">
                          {format(date, 'E')[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Check-in */}
              {!isCompleted && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Minutes"
                    value={checkInData[habit.id] || ''}
                    onChange={(e) => setCheckInData({
                      ...checkInData,
                      [habit.id]: parseInt(e.target.value) || 0
                    })}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => checkInHabit(habit.id)}
                    variant="primary"
                    disabled={!checkInData[habit.id] || checkInData[habit.id] <= 0}
                  >
                    Check In
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-lg font-semibold text-gray-900">{habit.currentStreak}</div>
                  <div className="text-xs text-gray-600">Current Streak</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-lg font-semibold text-gray-900">{habit.longestStreak}</div>
                  <div className="text-xs text-gray-600">Best Streak</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && !isAddingHabit && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-4">Start tracking your daily habits to build consistency</p>
          <Button onClick={() => setIsAddingHabit(true)} variant="primary">
            Add Your First Habit
          </Button>
        </div>
      )}
    </div>
  );
};