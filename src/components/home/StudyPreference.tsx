'use client';

import React from 'react';
import { Input, Switch } from '@heroui/react';
import type { UseFormRegister } from 'react-hook-form';
import type { UserProfile } from '../../types';

interface StudyPreferencesProps {
  register: UseFormRegister<UserProfile>;
  soundEffects: boolean;
  onSoundEffectsChange: (value: boolean) => void;
}

const StudyPreferences: React.FC<StudyPreferencesProps> = ({
  register,
  soundEffects,
  onSoundEffectsChange,
}) => {
  return (
    <div className='bg-white border border-gray-200 rounded-[14px] p-6'>
      <h3 className='text-base font-normal text-gray-900 mb-2'>
        Study Preferences
      </h3>
      <p className='text-sm text-gray-600 mb-6'>
        Customize your study sessions and learning habits
      </p>

      <div className='space-y-6'>
        {/* Three Inputs in a Row */}
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-2'>
              Focus Duration (min)
            </label>
            <Input
              {...register('focusDuration')}
              type='number'
              variant='flat'
              radius='sm'
              classNames={{
                input: 'bg-gray-100',
                inputWrapper: 'bg-gray-100 border-0',
              }}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-2'>
              Break Duration (min)
            </label>
            <Input
              {...register('breakDuration')}
              type='number'
              variant='flat'
              radius='sm'
              classNames={{
                input: 'bg-gray-100',
                inputWrapper: 'bg-gray-100 border-0',
              }}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-2'>
              Daily Goal (hours)
            </label>
            <Input
              {...register('dailyGoal')}
              type='number'
              variant='flat'
              radius='sm'
              classNames={{
                input: 'bg-gray-100',
                inputWrapper: 'bg-gray-100 border-0',
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className='h-px bg-gray-200' />

        {/* Sound Effects Toggle */}
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-normal text-gray-900'>Sound Effects</p>
            <p className='text-sm text-gray-600'>
              Play sounds for timer and notifications
            </p>
          </div>
          <Switch
            isSelected={soundEffects}
            onValueChange={onSoundEffectsChange}
            size='sm'
            classNames={{
              wrapper: 'bg-gray-900',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudyPreferences;
