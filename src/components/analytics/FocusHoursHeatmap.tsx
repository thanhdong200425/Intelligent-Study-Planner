import React from 'react';
import { Card } from '@heroui/react';
import { MoreHorizontal } from 'lucide-react';

// Generate sample heatmap data for 52 weeks (365 days)
const generateHeatmapData = () => {
  const data: number[][] = [];
  for (let week = 0; week < 52; week++) {
    const weekData: number[] = [];
    for (let day = 0; day < 7; day++) {
      // Random hours between 0 and 8
      weekData.push(Math.floor(Math.random() * 9));
    }
    data.push(weekData);
  }
  return data;
};

const heatmapData = generateHeatmapData();

const getColorForHours = (hours: number) => {
  if (hours === 0) return '#ebedf0';
  if (hours <= 2) return '#c6e48b';
  if (hours <= 4) return '#7bc96f';
  if (hours <= 6) return '#239a3b';
  return '#196127';
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const days = ['Mon', 'Wed', 'Fri'];

export const FocusHoursHeatmap: React.FC = () => {
  return (
    <Card className='p-6 shadow-sm'>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            Focus Hours Heatmap
          </h3>
          <p className='text-sm text-gray-500'>
            Daily focus hours over the past year
          </p>
        </div>
        <button className='p-1 hover:bg-gray-100 rounded'>
          <MoreHorizontal className='w-5 h-5 text-gray-400' />
        </button>
      </div>

      {/* Heatmap */}
      <div className='overflow-x-auto'>
        <div className='min-w-[1000px]'>
          {/* Month labels */}
          <div className='flex mb-2 ml-12'>
            {months.map((month, index) => (
              <div
                key={month}
                className='text-xs text-gray-500'
                style={{
                  width: `${100 / 12}%`,
                  textAlign: 'center',
                }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className='flex'>
            {/* Day labels */}
            <div className='flex flex-col justify-around mr-2 text-xs text-gray-500'>
              {days.map(day => (
                <div key={day} className='h-3'>
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap cells */}
            <div className='flex gap-1'>
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className='flex flex-col gap-1'>
                  {week.map((hours, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className='w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-gray-400'
                      style={{
                        backgroundColor: getColorForHours(hours),
                      }}
                      title={`${hours} hours`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className='flex items-center justify-end gap-2 mt-4 text-xs text-gray-500'>
            <span>Less</span>
            <div className='flex gap-1'>
              {[0, 2, 4, 6, 8].map(hours => (
                <div
                  key={hours}
                  className='w-3 h-3 rounded-sm'
                  style={{
                    backgroundColor: getColorForHours(hours),
                  }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
