'use client';

import React from 'react';
import { Card } from '@heroui/react';
import { MoreHorizontal } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = [
  { course: 'CS 101', hours: 27 },
  { course: 'Math', hours: 20 },
  { course: 'ML', hours: 36 },
  { course: 'Web Dev', hours: 31.5 },
  { course: 'Physics', hours: 17 },
];

export const StudyTimeByCourseChart: React.FC = () => {
  return (
    <Card className='p-6 shadow-sm'>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            Study Time by Course
          </h3>
          <p className='text-sm text-gray-500'>Total hours spent per course</p>
        </div>
        <button className='p-1 hover:bg-gray-100 rounded'>
          <MoreHorizontal className='w-5 h-5 text-gray-400' />
        </button>
      </div>

      {/* Chart */}
      <div className='h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} layout='vertical'>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis
              type='number'
              stroke='#9ca3af'
              style={{ fontSize: '12px' }}
            />
            <YAxis
              type='category'
              dataKey='course'
              stroke='#9ca3af'
              style={{ fontSize: '12px' }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}h`, 'Hours']}
            />
            <Bar dataKey='hours' fill='#3b82f6' radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
