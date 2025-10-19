'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Habit, HabitCompletion } from '@/types';
import { HabitStorage, HabitCompletionStorage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfDay, subDays, isSameDay } from 'date-fns';
import { Check, Plus, Target, MoreHorizontal } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  addToast,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from '@heroui/react';
import { HabitTrackerProps } from './HabitTracker.types';

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  onHabitUpdate,
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [checkInData, setCheckInData] = useState<{ [habitId: string]: number }>(
    {}
  );
  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null);
  const {
    isOpen,
    onOpen,
    onClose: onModalClose,
    onOpenChange,
  } = useDisclosure();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Habit>({
    defaultValues: {
      name: '',
      targetMinutes: undefined,
    },
    mode: 'onBlur',
  });

  const loadData = useCallback(() => {
    const allHabits = HabitStorage.getAll();
    const allCompletions = HabitCompletionStorage.getAll();
    setHabits(allHabits);
    setCompletions(allCompletions);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const onSubmitHandler = (data: Habit) => {
    const habit: Habit = {
      id: uuidv4(),
      name: data.name.trim(),
      targetMinutes: data.targetMinutes,
      currentStreak: 0,
      longestStreak: 0,
      completions: [],
    };

    HabitStorage.add(habit);

    addToast({
      title: 'Habit Added',
      color: 'success',
      timeout: 3000,
      shouldShowTimeoutProgress: true,
    });

    reset({
      name: '',
      targetMinutes: undefined,
    });
    loadData();
    onModalClose();
    onHabitUpdate?.();
  };

  const checkInHabit = (habitId: string) => {
    const minutes = checkInData[habitId] || 0;
    if (minutes <= 0) return;

    const today = startOfDay(new Date());

    // Check if already completed today
    const existingCompletion = completions.find(
      c => c.habitId === habitId && isSameDay(new Date(c.date), today)
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

    loadData();

    // Update habit streaks
    updateHabitStreaks(habitId);

    // Clear input
    setCheckInData({ ...checkInData, [habitId]: 0 });
    onHabitUpdate?.();
  };

  const handleDeleteHabit = () => {
    if (!deleteHabitId) return;
    // Remove the habit
    HabitStorage.remove(deleteHabitId);
    // Remove associated completions
    const related = HabitCompletionStorage.getByHabit(deleteHabitId);
    related.forEach(c => HabitCompletionStorage.remove(c.id));

    addToast({
      title: 'Habit Deleted',
      color: 'success',
      timeout: 2500,
      shouldShowTimeoutProgress: true,
    });

    setDeleteHabitId(null);
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
      const completion = habitCompletions.find(
        c =>
          isSameDay(new Date(c.date), checkDate) &&
          c.minutes >= habit.targetMinutes
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

    for (let i = 0; i < 365; i++) {
      // Check last year
      const completion = habitCompletions.find(
        c =>
          isSameDay(new Date(c.date), checkDate) &&
          c.minutes >= habit.targetMinutes
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

  const getTodayProgress = (
    habitId: string
  ): { completed: number; target: number; percentage: number } => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { completed: 0, target: 0, percentage: 0 };

    const today = startOfDay(new Date());
    const todayCompletion = completions.find(
      c => c.habitId === habitId && isSameDay(new Date(c.date), today)
    );

    const completed = todayCompletion?.minutes || 0;
    const target = habit.targetMinutes;
    const percentage =
      target > 0 ? Math.min((completed / target) * 100, 100) : 0;

    return { completed, target, percentage };
  };

  const getWeeklyProgress = (habitId: string): number[] => {
    const weekProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(startOfDay(new Date()), i);
      const completion = completions.find(
        c => c.habitId === habitId && isSameDay(new Date(c.date), date)
      );
      const habit = habits.find(h => h.id === habitId);
      const progress =
        habit && completion
          ? Math.min((completion.minutes / habit.targetMinutes) * 100, 100)
          : 0;
      weekProgress.push(progress);
    }
    return weekProgress;
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900'>Habit Tracker</h2>
        <Button
          onPress={onOpen}
          color='primary'
          size='sm'
          className='flex items-center gap-2'
        >
          <Plus className='w-4 h-4' />
          Add Habit
        </Button>
      </div>

      {/* Add Habit Modal */}
      <Modal isOpen={isOpen} onClose={onModalClose} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Add new habit</ModalHeader>
              <ModalBody>
                <Controller
                  control={control}
                  name='name'
                  rules={{
                    required: {
                      value: true,
                      message: 'Habit name is required',
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} label='Habit name' isRequired />
                  )}
                />

                <Controller
                  control={control}
                  name='targetMinutes'
                  rules={{
                    required: {
                      value: true,
                      message: 'Target minutes is required',
                    },
                    min: {
                      value: 1,
                      message: 'Target must be at least 1 minute',
                    },
                  }}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      label='Target Minutes'
                      minValue={1}
                      isInvalid={!!errors.targetMinutes?.message}
                      errorMessage={errors.targetMinutes?.message}
                      size='sm'
                      isRequired
                    />
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <div className='flex items-end gap-2'>
                  <Button
                    type='submit'
                    color='primary'
                    isLoading={isSubmitting}
                    onPress={() => {
                      handleSubmit(onSubmitHandler)();
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    type='button'
                    disabled={isSubmitting}
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Habits List */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {habits.map(habit => {
          const todayProgress = getTodayProgress(habit.id);
          const weeklyProgress = getWeeklyProgress(habit.id);
          const isCompleted = todayProgress.percentage >= 100;

          return (
            <Card key={habit.id} className='p-6'>
              {/* Habit Header */}
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {habit.name}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {habit.targetMinutes} minutes daily
                  </p>
                </div>
                <div className='flex items-center gap-1'>
                  {isCompleted && (
                    <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                      <Check className='w-5 h-5 text-green-600' />
                    </div>
                  )}
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        variant='light'
                        radius='full'
                        aria-label='More actions'
                      >
                        <MoreHorizontal className='w-5 h-5 text-gray-600' />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label='Habit actions'
                      onAction={key => {
                        if (key === 'delete') setDeleteHabitId(habit.id);
                      }}
                    >
                      <DropdownItem
                        key='delete'
                        className='text-danger'
                        color='danger'
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              {/* Today's Progress */}
              <div className='mb-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-medium text-gray-700'>
                    Today&apos;s Progress
                  </span>
                  <span className='text-sm text-gray-600'>
                    {todayProgress.completed} / {todayProgress.target} min
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${todayProgress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Weekly Progress */}
              <div className='mb-4'>
                <div className='text-sm font-medium text-gray-700 mb-2'>
                  This Week
                </div>
                <div className='flex gap-1'>
                  {weeklyProgress.map((progress, index) => {
                    const date = subDays(new Date(), 6 - index);
                    const isToday = isSameDay(date, new Date());
                    return (
                      <div key={index} className='flex-1'>
                        <div
                          className={`h-8 rounded-sm ${
                            progress >= 100
                              ? 'bg-green-200'
                              : progress >= 50
                                ? 'bg-yellow-200'
                                : progress > 0
                                  ? 'bg-gray-200'
                                  : 'bg-gray-100'
                          } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                          title={`${format(date, 'MMM d')}: ${Math.round(
                            progress
                          )}%`}
                        >
                          <div
                            className={`h-full rounded-sm ${
                              progress >= 100
                                ? 'bg-green-500'
                                : progress >= 50
                                  ? 'bg-yellow-500'
                                  : progress > 0
                                    ? 'bg-gray-400'
                                    : ''
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className='text-xs text-center mt-1 text-gray-500'>
                          {format(date, 'E')[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Check-in */}
              {!isCompleted && (
                <div className='flex gap-2'>
                  <Input
                    type='number'
                    min='1'
                    placeholder='Minutes'
                    label='Check-in Minutes'
                    value={checkInData[habit.id]?.toString() || ''}
                    onChange={e =>
                      setCheckInData({
                        ...checkInData,
                        [habit.id]: parseInt(e.target.value) || 0,
                      })
                    }
                    className='flex-1'
                    size='sm'
                    variant='bordered'
                  />
                  <Button
                    onPress={() => checkInHabit(habit.id)}
                    color='primary'
                    size='md'
                    disabled={
                      !checkInData[habit.id] || checkInData[habit.id] <= 0
                    }
                  >
                    Check In
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className='mt-4 grid grid-cols-2 gap-4 text-center'>
                <div className='p-2 bg-gray-50 rounded'>
                  <div className='text-lg font-semibold text-gray-900'>
                    {habit.currentStreak}
                  </div>
                  <div className='text-xs text-gray-600'>Current Streak</div>
                </div>
                <div className='p-2 bg-gray-50 rounded'>
                  <div className='text-lg font-semibold text-gray-900'>
                    {habit.longestStreak}
                  </div>
                  <div className='text-xs text-gray-600'>Best Streak</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Delete Habit Modal */}
      <Modal isOpen={!!deleteHabitId} onClose={() => setDeleteHabitId(null)}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Delete habit</ModalHeader>
              <ModalBody>
                <p className='text-sm text-gray-700'>
                  This will permanently delete the habit and all its check-in
                  history. This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <div className='flex items-end gap-2'>
                  <Button color='danger' onPress={handleDeleteHabit}>
                    Delete
                  </Button>
                  <Button onPress={onClose}>Cancel</Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {habits.length === 0 && (
        <div className='text-center py-12'>
          <Target className='w-12 h-12 mx-auto mb-4 text-gray-400' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No habits yet
          </h3>
          <p className='text-gray-600 mb-4'>
            Start tracking your daily habits to build consistency
          </p>
          <Button onPress={onOpen} color='primary'>
            Add Your First Habit
          </Button>
        </div>
      )}
    </div>
  );
};
