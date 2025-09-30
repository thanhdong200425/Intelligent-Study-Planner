'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const TodayFocusChart: React.FC = () => {
  const data: ChartData[] = [
    { label: 'Legal Customers', value: 35, color: '#8B5CF6' },
    { label: 'New Customers', value: 25, color: '#10B981' },
    { label: 'Unique Customers', value: 40, color: '#F59E0B' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Simple line chart simulation
  const generatePoints = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 300;
        const y = 100 - (value / Math.max(...values)) * 80;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const chartValues = [20, 45, 35, 60, 55, 70, 65, 80, 75, 90, 85, 95];

  return (
    <Card className='w-full'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-center w-full'>
          <h3 className='text-sm font-semibold text-gray-900'>Today Focus</h3>
          <span className='text-xs text-gray-500'>NOV 7-8</span>
        </div>
      </CardHeader>
      <CardBody className='pt-0'>
        {/* Simple Line Chart */}
        <div className='mb-4'>
          <svg width='100%' height='100' viewBox='0 0 300 100' className='mb-2'>
            {/* Chart lines */}
            <polyline
              points={generatePoints(chartValues)}
              fill='none'
              stroke='#EC4899'
              strokeWidth='2'
              className='drop-shadow-sm'
            />
            <polyline
              points={generatePoints(chartValues.map(v => v - 10))}
              fill='none'
              stroke='#8B5CF6'
              strokeWidth='2'
              className='drop-shadow-sm'
            />
            <polyline
              points={generatePoints(chartValues.map(v => v - 20))}
              fill='none'
              stroke='#10B981'
              strokeWidth='2'
              className='drop-shadow-sm'
            />
          </svg>

          {/* Days of week */}
          <div className='flex justify-between text-xs text-gray-400 px-1'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className='space-y-2'>
          {data.map((item, index) => (
            <div key={item.label} className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: item.color }}
                />
                <span className='text-xs text-gray-600'>{item.label}</span>
              </div>
              <span className='text-xs font-medium text-gray-900'>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const UpcomingChart: React.FC = () => {
  const data: ChartData[] = [
    { label: 'Legal Customers', value: 30, color: '#EC4899' },
    { label: 'New Customers', value: 35, color: '#10B981' },
    { label: 'Unique Customers', value: 35, color: '#F59E0B' },
  ];

  // Simple line chart simulation for upcoming
  const generatePoints = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 300;
        const y = 100 - (value / Math.max(...values)) * 80;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const chartValues = [30, 25, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75];

  return (
    <Card className='w-full'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-center w-full'>
          <h3 className='text-sm font-semibold text-gray-900'>Upcoming</h3>
          <span className='text-xs text-gray-500'>JUL</span>
        </div>
      </CardHeader>
      <CardBody className='pt-0'>
        {/* Simple Line Chart */}
        <div className='mb-4'>
          <svg width='100%' height='100' viewBox='0 0 300 100' className='mb-2'>
            {/* Chart lines */}
            <polyline
              points={generatePoints(chartValues)}
              fill='none'
              stroke='#EC4899'
              strokeWidth='2'
              className='drop-shadow-sm'
            />
            <polyline
              points={generatePoints(chartValues.map(v => v + 5))}
              fill='none'
              stroke='#8B5CF6'
              strokeWidth='2'
              className='drop-shadow-sm'
            />
            <polyline
              points={generatePoints(chartValues.map(v => v - 5))}
              fill='none'
              stroke='#10B981'
              strokeWidth='2'
              className='drop-shadow-sm'
            />
          </svg>

          {/* Days of week */}
          <div className='flex justify-between text-xs text-gray-400 px-1'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className='space-y-2'>
          {data.map((item, index) => (
            <div key={item.label} className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: item.color }}
                />
                <span className='text-xs text-gray-600'>{item.label}</span>
              </div>
              <span className='text-xs font-medium text-gray-900'>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export const AnalyticsPanel: React.FC = () => {
  return (
    <div className='w-80 bg-gray-50 border-l border-gray-200 p-6 space-y-6'>
      <TodayFocusChart />
      <UpcomingChart />
    </div>
  );
};
