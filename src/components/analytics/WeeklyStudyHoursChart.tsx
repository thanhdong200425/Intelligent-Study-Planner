'use client';

import React from 'react';
import { Card } from '@heroui/react';
import { MoreHorizontal, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useWeeklyStudyHours } from '@/hooks/useAnalyticsStats';

export const WeeklyStudyHoursChart: React.FC = () => {
  const { data, isLoading } = useWeeklyStudyHours();

  const hasData = data && data.length > 0 && data.some((d) => d.hours > 0);

  return (
    <Card className='p-6 shadow-sm'>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            Weekly Study Hours
          </h3>
          <p className='text-sm text-gray-500'>Daily breakdown of study time</p>
        </div>
        <button className='p-1 hover:bg-gray-100 rounded'>
          <MoreHorizontal className='w-5 h-5 text-gray-400' />
        </button>
      </div>

      {/* Chart / Loading / Empty State */}
      <div className='h-[300px]'>
        {isLoading ? (
          <div className='h-full bg-gray-100 rounded-lg animate-pulse' />
        ) : hasData ? (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
              <XAxis
                dataKey='day'
                stroke='#9ca3af'
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke='#9ca3af' style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value}h`, 'Study Hours']}
              />
              <Bar dataKey='hours' fill='#3b82f6' radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <BarChart3 className='w-12 h-12 mb-3 opacity-50' />
            <p className='text-sm'>No study hours recorded this week</p>
          </div>
        )}
      </div>
    </Card>
  );
};
