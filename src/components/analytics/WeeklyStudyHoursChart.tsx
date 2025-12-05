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
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 5.8 },
  { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 6.5 },
  { day: 'Sat', hours: 3.5 },
  { day: 'Sun', hours: 2.8 },
];

export const WeeklyStudyHoursChart: React.FC = () => {
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

      {/* Chart */}
      <div className='h-[300px]'>
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
      </div>
    </Card>
  );
};
