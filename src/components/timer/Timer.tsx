'use client';

import React from 'react';
import { TimeBlock } from '@/types';
import { Tab, Tabs } from '@heroui/react';

interface TimerProps {
  timeBlock?: TimeBlock;
  onComplete?: (actualMinutes: number) => void;
  onCancel?: () => void;
}

interface PomoContainerProps {
  minutes: number;
  seconds: number;
  hours?: number;
}

export const Timer: React.FC<TimerProps> = ({ ...props }) => {
  return (
    <div className='flex flex-col'>
      <Tabs aria-label='Timer Tabs'>
        <Tab key='focus' title='Focus'>
          <PomoContainer minutes={25} seconds={0} />
        </Tab>
        <Tab key='break' title='Break'></Tab>
        <Tab key='rest' title='Rest'></Tab>
      </Tabs>
    </div>
  );
};

const PomoContainer: React.FC<PomoContainerProps> = ({ ...props }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-12 self-stretch'>
      {/* Timer */}
      <div>
        <p>
          {props.hours ? props.hours + ' ' : ''} {props.minutes} :{' '}
          {props.seconds}
        </p>
      </div>

      {/* Buttons */}
    </div>
  );
};
