'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SidebarNav, HeaderBar } from '@/components';
import {
  DashboardHero,
  DeadlineCard,
} from '@/components/today/DashboardWidgets';
import { TaskCard } from '@/components/tasks/TaskCard';
import StatCard from '@/components/home/StatCard';
import { getTodayData } from '@/services';
import { CheckSquare, Clock, Flame, Target } from 'lucide-react';

// Helper function to format time in hours and minutes
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export default function TodayPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['today'],
    queryFn: getTodayData,
  });

  // Calculate dynamic values
  const tasksRemaining = useMemo(() => {
    if (!data) return 0;
    return data.stats.totalOpenTasks - data.stats.tasksCompletedToday;
  }, [data]);

  const tasksCompletedValue = useMemo(() => {
    if (!data) return '0/0';
    return `${data.stats.tasksCompletedToday}/${data.stats.totalOpenTasks}`;
  }, [data]);

  const timeRemainingValue = useMemo(() => {
    if (!data) return '0m';
    return formatTime(data.stats.timeRemaining);
  }, [data]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex'>
        <SidebarNav />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <HeaderBar title='Today' description='Your daily dashboard' />
          <main className='flex-1 flex items-center justify-center'>
            <div className='text-gray-500'>Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex'>
        <SidebarNav />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <HeaderBar title='Today' description='Your daily dashboard' />
          <main className='flex-1 flex items-center justify-center'>
            <div className='text-red-500'>
              Error loading today's data. Please try again.
            </div>
          </main>
        </div>
      </div>
    );
  }

  const todaysTasks = data?.todaysTasks || [];
  const upcomingDeadlines = data?.upcomingDeadlines || [];
  const stats = data?.stats;

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <SidebarNav />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <HeaderBar title='Today' description='Your daily dashboard' />

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto p-8 pt-8'>
          <div className='max-w-7xl mx-auto space-y-6'>
            <DashboardHero />

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Main Task Column */}
              <div className='lg:col-span-2 space-y-4'>
                <div className='flex justify-between items-center mb-2'>
                  <div>
                    <h3 className='text-gray-800 font-semibold'>
                      Today's Tasks
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {tasksRemaining} {tasksRemaining === 1 ? 'task' : 'tasks'}{' '}
                      remaining
                    </p>
                  </div>
                  <button className='px-4 py-2 rounded-lg text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none'>
                    View All →
                  </button>
                </div>

                <div className='space-y-3'>
                  {todaysTasks.length === 0 ? (
                    <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center'>
                      <p className='text-gray-500'>
                        No tasks for today. Great job! 🎉
                      </p>
                    </div>
                  ) : (
                    todaysTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar Column (Deadlines) */}
              <div className='space-y-4'>
                <div className='flex justify-between items-center mb-2 h-[50px]'>
                  <h3 className='text-gray-800 font-semibold'>
                    Upcoming Deadlines
                  </h3>
                  <div className='p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-500'>
                    <Clock className='size-4' />
                  </div>
                </div>

                <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
                  {upcomingDeadlines.length === 0 ? (
                    <p className='text-center text-gray-500 py-4'>
                      No upcoming deadlines
                    </p>
                  ) : (
                    upcomingDeadlines.map(deadline => (
                      <DeadlineCard key={deadline.id} deadline={deadline} />
                    ))
                  )}
                  <button className='w-full mt-2 px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-100 hover:bg-gray-50 transition-colors focus:outline-none'>
                    View Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8'>
              <StatCard
                icon={<CheckSquare className='size-6' />}
                value={tasksCompletedValue}
                title='Tasks Completed'
                bgColor='bg-blue-50'
                iconColor='text-blue-600'
              />
              <StatCard
                icon={<Clock className='size-6' />}
                value={timeRemainingValue}
                title='Time Remaining'
                bgColor='bg-orange-50'
                iconColor='text-orange-600'
              />
              <StatCard
                icon={<Target className='size-6' />}
                value={stats?.highPriorityCount.toString() || '0'}
                title='High Priority'
                bgColor='bg-red-50'
                iconColor='text-red-600'
              />
              <StatCard
                icon={<Flame className='size-6' />}
                value={stats?.dayStreak.toString() || '0'}
                title='Day Streak'
                bgColor='bg-green-50'
                iconColor='text-green-600'
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
