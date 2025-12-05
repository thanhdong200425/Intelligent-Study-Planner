import React from 'react';
import { Card } from '@heroui/react';
import { MoreHorizontal } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { week: 'Week 1', completed: 18, total: 24 },
  { week: 'Week 2', completed: 21, total: 27 },
  { week: 'Week 3', completed: 24, total: 30 },
  { week: 'Week 4', completed: 27, total: 33 },
  { week: 'Week 5', completed: 22, total: 28 },
  { week: 'Week 6', completed: 30, total: 36 },
];

export const WeeklyTaskCompletionChart: React.FC = () => {
  return (
    <Card className='p-6 shadow-sm'>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            Weekly Task Completion
          </h3>
          <p className='text-sm text-gray-500'>
            Completed vs total tasks over 6 weeks
          </p>
        </div>
        <button className='p-1 hover:bg-gray-100 rounded'>
          <MoreHorizontal className='w-5 h-5 text-gray-400' />
        </button>
      </div>

      {/* Chart */}
      <div className='h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis
              dataKey='week'
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
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType='circle'
              iconSize={10}
            />
            <Line
              type='monotone'
              dataKey='completed'
              stroke='#10b981'
              strokeWidth={2}
              name='Completed Tasks'
              dot={{ r: 4 }}
            />
            <Line
              type='monotone'
              dataKey='total'
              stroke='#6b7280'
              strokeWidth={2}
              name='Total Tasks'
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
