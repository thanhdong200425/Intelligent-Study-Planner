'use client';

import React from 'react';
import { Card } from '@heroui/react';
import { MoreHorizontal, PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTaskDistribution } from '@/hooks/useAnalyticsStats';

export const TaskDistributionChart: React.FC = () => {
  const { data, isLoading } = useTaskDistribution();

  // Calculate percentages from counts
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return [];

    return data.map(item => ({
      ...item,
      percentage: Math.round((item.value / total) * 100),
    }));
  }, [data]);

  const hasData = chartData.length > 0;

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

      {/* Chart / Loading / Empty State */}
      <div className='h-[300px]'>
        {isLoading ? (
          <div className='h-full bg-gray-100 rounded-lg animate-pulse' />
        ) : hasData ? (
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={entry => `${entry.name} ${entry.percent}%`}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {chartData.map((entry, index) => (
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
                formatter={(value: number) => [`${value}`, 'Tasks']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <PieChartIcon className='w-12 h-12 mb-3 opacity-50' />
            <p className='text-sm'>No tasks created yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};
