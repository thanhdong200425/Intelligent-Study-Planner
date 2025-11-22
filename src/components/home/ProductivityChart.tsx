'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { name: 'Mon', value: 80, color: '#FBBF24' },
  { name: 'Tue', value: 0, color: '#E5E7EB' },
  { name: 'Wed', value: 70, color: '#22D3EE' },
  { name: 'Thu', value: 60, color: '#818CF8' },
  { name: 'Fri', value: 0, color: '#E5E7EB' },
  { name: 'Sat', value: 0, color: '#E5E7EB' },
  { name: 'Sun', value: 0, color: '#E5E7EB' },
];

const renderYAxisTick = (props: any) => {
  const { y, payload } = props;
  return (
    <text x={0} y={y} dy={4} textAnchor='start' fill='#6B7280'>
      {payload.value}
    </text>
  );
};

const ProductivityChart: React.FC = () => {
  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>Productivity</h3>
        <p className='text-sm text-gray-500'>6 hours 24 min</p>
      </div>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout='vertical'
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis type='number' hide domain={[0, 100]} />
            <YAxis
              type='category'
              dataKey='name'
              axisLine={false}
              tickLine={false}
              width={40}
              tick={renderYAxisTick}
            />
            <Bar
              dataKey='value'
              barSize={20}
              background={{ fill: '#F3F4F6', radius: 8 }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value > 0 ? entry.color : 'transparent'}
                  radius={8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='flex justify-center items-center gap-4 mt-4 text-sm text-gray-600'>
        <div className='flex items-center'>
          <span className='w-2.5 h-2.5 rounded-full bg-yellow-400 mr-2'></span>
          Design
        </div>
        <div className='flex items-center'>
          <span className='w-2.5 h-2.5 rounded-full bg-cyan-400 mr-2'></span>
          Animation
        </div>
        <div className='flex items-center'>
          <span className='w-2.5 h-2.5 rounded-full bg-indigo-400 mr-2'></span>
          Research
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;
