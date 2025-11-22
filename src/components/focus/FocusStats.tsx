import React from 'react';
import { fromSeconds } from '@/utils';

interface FocusStatsProps {
  sessionsToday: number;
  timeFocused: number; // in seconds
  cyclesComplete: number;
}

export const FocusStats: React.FC<FocusStatsProps> = ({
  sessionsToday,
  timeFocused,
  cyclesComplete,
}) => {
  const { hours, minutes } = fromSeconds(timeFocused);
  const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className='border-t border-gray-100 pt-6 flex items-center justify-between'>
      <div className='flex flex-col items-center flex-1'>
        <div className='text-2xl font-normal text-gray-900 mb-1'>
          {sessionsToday}
        </div>
        <div className='text-sm text-gray-600 text-center'>Sessions Today</div>
      </div>
      <div className='flex flex-col items-center flex-1'>
        <div className='text-2xl font-normal text-gray-900 mb-1'>
          {formattedTime}
        </div>
        <div className='text-sm text-gray-600 text-center'>Time Focused</div>
      </div>
      <div className='flex flex-col items-center flex-1'>
        <div className='text-2xl font-normal text-gray-900 mb-1'>
          {cyclesComplete}
        </div>
        <div className='text-sm text-gray-600 text-center'>Cycles Complete</div>
      </div>
    </div>
  );
};
