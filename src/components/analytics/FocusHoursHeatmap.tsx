'use client';

import React, { useMemo } from 'react';
import { Card, Tooltip } from '@heroui/react';
import { MoreHorizontal } from 'lucide-react';
import { useFocusHoursHeatmap } from '@/hooks/useAnalyticsStats';
import { parseISO, getDay, startOfWeek, format } from 'date-fns';

// Transform flat date array to 52-week grid (7 days x 52 weeks)
const transformToWeeklyGrid = (
  data: Array<{ date: string; hours: number }>
) => {
  const hoursGrid: number[][] = Array.from({ length: 52 }, () =>
    Array(7).fill(0)
  );
  const dateGrid: string[][] = Array.from({ length: 52 }, () =>
    Array(7).fill('')
  );

  if (data.length === 0) return { hoursGrid, dateGrid };

  const firstDate = parseISO(data[0].date);
  const firstSunday = startOfWeek(firstDate, { weekStartsOn: 0 });

  data.forEach(({ date, hours }) => {
    const currentDate = parseISO(date);
    const daysSinceStart = Math.floor(
      (currentDate.getTime() - firstSunday.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weekIndex = Math.floor(daysSinceStart / 7);
    const dayIndex = getDay(currentDate);

    if (weekIndex >= 0 && weekIndex < 52 && dayIndex >= 0 && dayIndex < 7) {
      hoursGrid[weekIndex][dayIndex] = hours;
      dateGrid[weekIndex][dayIndex] = date;
    }
  });

  return { hoursGrid, dateGrid };
};

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
  const { data, isLoading, isError, error } = useFocusHoursHeatmap();

  const { hoursGrid, dateGrid } = useMemo(() => {
    if (!data) return { hoursGrid: [], dateGrid: [] };
    return transformToWeeklyGrid(data);
  }, [data]);

  if (isLoading) {
    return (
      <Card className='p-6 shadow-sm'>
        <div className='flex items-start justify-between mb-8'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>
              Focus Hours Heatmap
            </h3>
            <p className='text-sm text-gray-500'>
              Daily focus hours over the past year
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center h-40'>
          <p className='text-gray-500'>Loading heatmap...</p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className='p-6 shadow-sm'>
        <div className='flex items-start justify-between mb-8'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>
              Focus Hours Heatmap
            </h3>
            <p className='text-sm text-gray-500'>
              Daily focus hours over the past year
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center h-40'>
          <p className='text-red-500'>
            Failed to load heatmap: {error?.message || 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

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
              {hoursGrid.map((week, weekIndex) => (
                <div key={weekIndex} className='flex flex-col gap-1'>
                  {week.map((hours, dayIndex) => {
                    const dateStr = dateGrid[weekIndex]?.[dayIndex];
                    const formattedDate = dateStr
                      ? format(parseISO(dateStr), 'MMM d, yyyy')
                      : '';
                    const tooltipContent =
                      hours === 0
                        ? `${formattedDate}\nNo focus time`
                        : `${formattedDate}\n${hours} hour${hours !== 1 ? 's' : ''}`;

                    return (
                      <Tooltip
                        key={`${weekIndex}-${dayIndex}`}
                        content={
                          <div className='text-center'>
                            <div className='font-medium'>{formattedDate}</div>
                            <div className='text-sm'>
                              {hours === 0
                                ? 'No focus time'
                                : `${hours} hour${hours !== 1 ? 's' : ''}`}
                            </div>
                          </div>
                        }
                        placement='top'
                        delay={0}
                        closeDelay={0}
                      >
                        <div
                          className='w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all'
                          style={{
                            backgroundColor: getColorForHours(hours),
                          }}
                        />
                      </Tooltip>
                    );
                  })}
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
