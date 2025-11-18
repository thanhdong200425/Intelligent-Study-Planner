'use client';

import React, { useMemo, useState } from 'react';
import { Input, Textarea, Button, Avatar, Tooltip } from '@heroui/react';
import {
  CameraIcon,
  PlannerIcon,
  LocationIcon,
  EditIcon,
} from '@/components/icons/Icons';
import { BaseButton } from '@/components/buttons';
import type { UseFormRegister } from 'react-hook-form';
import type { UserProfile } from '../../types';
import { CheckIcon, InfoIcon } from 'lucide-react';
import { getMonth, getYear } from 'date-fns';
import { monthNames } from '@/utils';

interface ProfileDetailsProps {
  register: UseFormRegister<UserProfile>;
  name: string;
  email: string;
  location: string;
  joinedDate: string;
  onSave?: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  register,
  name,
  email,
  location,
  joinedDate,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const joinedMonthYear = useMemo(() => {
    const joinedMonth = getMonth(joinedDate) + 1;
    const joinedYear = getYear(joinedDate);

    return `${monthNames[joinedMonth]} ${joinedYear}`;
  }, [joinedDate]);

  // Center details next to avatar when name and location are absent
  const isMinimalInfo = !name && !location;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className='bg-white border border-gray-200 rounded-[14px] p-8'>
      {/* Profile Header with Avatar and Edit Button */}
      <div className='flex items-start justify-between mb-12'>
        <div
          className={`flex ${isMinimalInfo ? 'items-center' : 'items-start'} gap-6`}
        >
          {/* Avatar with Camera Button */}
          <div className='relative'>
            <Avatar
              name={name}
              size='lg'
              radius='full'
              className='w-24 h-24 text-2xl font-medium'
              classNames={{
                base: 'bg-linear-to-br from-blue-500 to-purple-600',
                name: 'text-white',
              }}
            />
            {isEditing ? (
              <Button
                isIconOnly
                size='sm'
                className='absolute bottom-0 right-0 bg-gray-900 min-w-8 h-8 rounded-full'
              >
                <CameraIcon className='w-4 h-4 text-white' />
              </Button>
            ) : null}
          </div>

          {/* User Info */}
          <div
            className={`flex flex-col gap-1 justify-center ${isMinimalInfo ? 'items-center text-center' : ''}`}
          >
            {name && (
              <h2 className='text-base font-normal text-gray-900'>{name}</h2>
            )}
            <h3 className='text-sm text-gray-600'>
              {email || 'email@example.com'}
            </h3>
            <div className='flex items-center gap-4 mt-1'>
              <span className='flex items-center text-sm text-gray-600'>
                <PlannerIcon className='w-4 h-4 mr-1' />
                {'Joined ' + joinedMonthYear}
              </span>
              {location && (
                <span className='flex items-center text-sm text-gray-600'>
                  <LocationIcon className='w-4 h-4 mr-1' />
                  {location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <BaseButton
          variant='bordered'
          className='w-auto! bg-transparent! text-gray-900! border-gray-200 hover:bg-gray-50! flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition'
          content={isEditing ? 'Save' : 'Edit Profile'}
          startContent={
            isEditing ? (
              <CheckIcon className='w-4 h-4' />
            ) : (
              <EditIcon className='w-4 h-4' />
            )
          }
          onPress={() => {
            if (isEditing && onSave) {
              onSave();
            }
            setIsEditing(!isEditing);
          }}
        />
      </div>

      {/* Divider */}
      <div className='h-px bg-gray-200 mb-12' />

      {/* Editable Fields */}
      <div className='space-y-4'>
        {/* Full Name and Email Row */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-2'>
              Full Name
            </label>
            <Input
              {...register('name')}
              disabled={!isEditing}
              variant='flat'
              radius='sm'
              classNames={{
                input: isEditing ? 'bg-white' : 'bg-gray-100',
                inputWrapper: isEditing
                  ? 'bg-white border-0'
                  : 'bg-gray-100 border-0',
              }}
            />
          </div>
          <div>
            <div className='flex  gap-2 items-center'>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Email Address
              </label>
              <div>
                <Tooltip content='Please contact us if you want to change your email address'>
                  <InfoIcon className='w-4 h-4 text-gray-600' />
                </Tooltip>
              </div>
            </div>
            <Input
              {...register('email')}
              disabled={true}
              type='email'
              variant='flat'
              radius='sm'
              classNames={{
                input: 'bg-gray-100',
                inputWrapper: 'bg-gray-100 border-0',
              }}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className='block text-sm font-medium text-gray-900 mb-2'>
            Location
          </label>
          <Input
            {...register('location')}
            variant='flat'
            disabled={!isEditing}
            radius='sm'
            classNames={{
              input: isEditing ? 'bg-white' : 'bg-gray-100',
              inputWrapper: isEditing
                ? 'bg-white border-0'
                : 'bg-gray-100 border-0',
            }}
          />
        </div>

        {/* Bio */}
        <div>
          <label className='block text-sm font-medium text-gray-900 mb-2'>
            Bio
          </label>
          <Textarea
            {...register('bio')}
            variant='bordered'
            radius='md'
            disabled={!isEditing}
            minRows={3}
            classNames={{
              input: isEditing ? 'bg-white' : 'bg-gray-100',
              inputWrapper: isEditing
                ? 'border-gray-200 bg-white'
                : 'border-gray-200 bg-gray-100',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
