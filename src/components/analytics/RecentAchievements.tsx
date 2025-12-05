'use client';

import React from 'react';
import { Card } from '@heroui/react';
import { MoreHorizontal, Flame, CheckCircle2, Trophy } from 'lucide-react';

const achievements = [
  {
    id: 1,
    icon: Flame,
    title: '7-Day Streak',
    description: 'Studied every day this week',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: 2,
    icon: CheckCircle2,
    title: '50 Tasks',
    description: 'Completed this month',
    color: 'bg-green-50 text-green-600',
  },
  {
    id: 3,
    icon: Trophy,
    title: 'Top Performer',
    description: '95% in Machine Learning',
    color: 'bg-yellow-50 text-yellow-600',
  },
];

export const RecentAchievements: React.FC = () => {
  return (
    <Card className='p-6 shadow-sm'>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            Recent Achievements
          </h3>
          <p className='text-sm text-gray-500'>Your latest milestones</p>
        </div>
        <button className='p-1 hover:bg-gray-100 rounded'>
          <MoreHorizontal className='w-5 h-5 text-gray-400' />
        </button>
      </div>

      {/* Achievements Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {achievements.map(achievement => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'
            >
              <div className='flex items-center gap-3 mb-3'>
                <div
                  className={`w-9 h-9 rounded-lg ${achievement.color} flex items-center justify-center`}
                >
                  <Icon className='w-5 h-5' />
                </div>
                <h4 className='font-semibold text-gray-900'>
                  {achievement.title}
                </h4>
              </div>
              <p className='text-sm text-gray-500'>{achievement.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
