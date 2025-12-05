import React from 'react';
import { Card } from '@heroui/react';
import { MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Reading', value: 30, color: '#3b82f6' },
  { name: 'Coding', value: 24, color: '#8b5cf6' },
  { name: 'Writing', value: 15, color: '#10b981' },
  { name: 'Pset', value: 21, color: '#f59e0b' },
  { name: 'Others', value: 10, color: '#6b7280' },
];

export const TaskDistributionChart: React.FC = () => {
  return (
    <Card className='p-6 shadow-sm'>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            Task Distribution
          </h3>
          <p className='text-sm text-gray-500'>Breakdown by task type</p>
        </div>
        <button className='p-1 hover:bg-gray-100 rounded'>
          <MoreHorizontal className='w-5 h-5 text-gray-400' />
        </button>
      </div>

      {/* Chart */}
      <div className='h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={entry => `${entry.name} ${entry.value}%`}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}%`, 'Percentage']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
