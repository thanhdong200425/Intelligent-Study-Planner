'use client';

import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button, Card, CardBody } from '@heroui/react';

interface ModernCalendarGridProps {
  weekStart?: Date;
}

const ModernCalendarGrid: React.FC<ModernCalendarGridProps> = ({
  weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }),
}) => {
  const [currentWeek, setCurrentWeek] = useState(weekStart);

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  const goToToday = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return (
    <div className='flex-1 p-6 bg-white'>
      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='light'
            onPress={goToToday}
            className='text-blue-600 font-medium'
          >
            Today
          </Button>
          <div className='flex items-center space-x-1'>
            <Button
              isIconOnly
              variant='light'
              onPress={goToPreviousWeek}
              className='text-gray-600'
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
              isIconOnly
              variant='light'
              onPress={goToNextWeek}
              className='text-gray-600'
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2 text-gray-600'>
            <Calendar className='w-4 h-4' />
            <span className='text-sm'>Week</span>
          </div>
          <div className='flex items-center space-x-2 text-gray-600'>
            <span className='text-sm'>Month</span>
          </div>
          <div className='flex items-center space-x-2 text-gray-600'>
            <span className='text-sm'>Year</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className='shadow-sm'>
        <CardBody className='p-0'>
          {/* Days Header */}
          <div className='grid grid-cols-8 border-b border-gray-100'>
            <div className='p-4 text-sm font-medium text-gray-500'></div>
            {days.map((day, index) => {
              const date = addDays(currentWeek, index);
              const isToday =
                format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

              return (
                <div
                  key={day}
                  className='p-4 text-center border-r border-gray-100 last:border-r-0'
                >
                  <div className='text-sm font-medium text-gray-600'>{day}</div>
                  <div
                    className={`text-lg font-semibold mt-1 ${isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}
                  >
                    {format(date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div className='grid grid-cols-8'>
            {hours.map(hour => (
              <React.Fragment key={hour}>
                {/* Time column */}
                <div className='p-3 text-xs text-gray-500 border-b border-gray-50 bg-gray-50/50 flex items-start'>
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </div>

                {/* Day columns */}
                {days.map((_, dayIndex) => {
                  const currentHour = new Date().getHours();
                  const isCurrentHour = hour === currentHour;
                  const isPastHour = hour < currentHour;

                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className={`relative border-b border-r border-gray-50 h-12 transition-colors hover:bg-blue-50/30 cursor-pointer ${isPastHour ? 'bg-gray-50/30' : ''
                        } ${isCurrentHour ? 'bg-blue-50/50' : ''}`}
                    >
                      {/* Sample time blocks */}
                      {hour === 9 && dayIndex === 1 && (
                        <div className='absolute inset-1 bg-blue-100 border border-blue-200 rounded p-1'>
                          <div className='text-xs font-medium text-blue-800'>
                            Meeting
                          </div>
                        </div>
                      )}
                      {hour === 14 && dayIndex === 2 && (
                        <div className='absolute inset-1 bg-green-100 border border-green-200 rounded p-1'>
                          <div className='text-xs font-medium text-green-800'>
                            Study
                          </div>
                        </div>
                      )}
                      {hour === 11 && dayIndex === 4 && (
                        <div className='absolute inset-1 bg-purple-100 border border-purple-200 rounded p-1'>
                          <div className='text-xs font-medium text-purple-800'>
                            Review
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ModernCalendarGrid;