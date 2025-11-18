import React from 'react';
import { Controller } from 'react-hook-form';
import { Input, Textarea, Avatar, Button } from '@heroui/react';
import {
  CameraIcon,
  PlannerIcon,
  LocationIcon,
  EditIcon,
} from '@/components/icons/Icons';
import type {
  UseFormRegister,
  Control,
  UseFormSetValue,
} from 'react-hook-form';
import type { UserProfile } from '../../types';

interface ProfileDetailsProps {
  register: UseFormRegister<UserProfile>;
  control: Control<UserProfile>;
  setValue: UseFormSetValue<UserProfile>;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  register,
  control,
  setValue,
}) => {
  return (
    <div className='bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200'>
      <div className='flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6'>
        {/* Avatar */}
        <div className='relative'>
          <Avatar
            radius='full'
            size='lg'
            className='w-24 h-24 text-2xl'
            color='primary'
          />
          <Button
            isIconOnly
            radius='full'
            size='sm'
            variant='solid'
            className='absolute bottom-0 right-0 bg-slate-800 text-white hover:bg-slate-700'
          >
            <CameraIcon className='w-4 h-4' />
          </Button>
        </div>

        {/* Basic Info */}
        <div className='flex-1 text-center sm:text-left mt-4 sm:mt-0'>
          <Controller
            name='fullName'
            control={control}
            render={({ field }) => (
              <Input {...field} label='Họ và tên' className='mb-2' size='sm' />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type='email'
                label='Email'
                className='mb-2'
                size='sm'
              />
            )}
          />

          <div className='flex items-center justify-center sm:justify-start space-x-4 mt-2 text-sm text-slate-500'>
            <span className='flex items-center'>
              <PlannerIcon className='w-4 h-4 mr-1.5' />
              {/** joinedDate chỉ đọc, user không sửa */}
              <Controller
                name='joinedDate'
                control={control}
                render={({ field }) => <span>{field.value}</span>}
              />
            </span>

            <span className='flex items-center'>
              <LocationIcon className='w-4 h-4 mr-1.5' />
              <Controller
                name='location'
                control={control}
                render={({ field }) => <span>{field.value}</span>}
              />
            </span>
          </div>
        </div>

        <button className='mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition'>
          <EditIcon className='w-4 h-4' />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      {/* More Editable Fields */}
      <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Controller
          name='location'
          control={control}
          render={({ field }) => <Input {...field} label='Địa chỉ' size='sm' />}
        />

        <div className='md:col-span-2'>
          <Controller
            name='bio'
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label='Giới thiệu bản thân'
                className='h-28'
              />
            )}
          />

          <p className='mt-1 text-xs text-amber-600'>
            ⚠️ Thông tin này chỉ lưu tạm thời trên trình duyệt và chưa được đồng
            bộ với server.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
