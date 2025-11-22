'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, addToast } from '@heroui/react';
import { Plus } from 'lucide-react';
import { BaseButton } from '../buttons';
import { useCreateCourseMutation } from '@/mutations';
import { useQueryClient } from '@tanstack/react-query';

interface AddCourseFormData {
  name: string;
  color: string;
}

const PRESET_COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f97316', // orange-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
  '#14b8a6', // teal-500
  '#6366f1', // indigo-500
  '#f59e0b', // amber-500
  '#06b6d4', // cyan-500
  '#16a34a', // emerald-600
  '#f43f5e', // rose-500
];

export const AddCourseForm: React.FC = () => {
  const defaultColor = PRESET_COLORS[0];
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddCourseFormData>({
    defaultValues: {
      name: '',
      color: defaultColor,
    },
  });

  const { mutate: createCourse, isPending } = useCreateCourseMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      reset({ name: '', color: defaultColor });
      setSelectedColor(defaultColor);
      setValue('color', defaultColor);
      addToast({
        title: 'Course added successfully',
        color: 'success',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
    },
    onError: error => {
      console.error('Failed to create course:', error);
      addToast({
        title: 'Failed to add course',
        color: 'danger',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const onSubmit = (data: AddCourseFormData) => {
    createCourse({
      name: data.name.trim(),
      color: selectedColor,
    });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setValue('color', color);
  };

  return (
    <div className='bg-white border border-gray-200 rounded-[14px] p-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
        {/* Header */}
        <div className='flex items-center gap-2'>
          <h2 className='text-base font-normal text-gray-900 leading-6'>
            Add New Course
          </h2>
        </div>

        {/* Form fields */}
        <div className='grid grid-cols-2 gap-6'>
          {/* Course Name */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-gray-950 leading-[14px]'>
              Course Name
            </label>
            <Controller
              name='name'
              control={control}
              rules={{ required: 'Course name is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Enter course name'
                  classNames={{
                    base: 'h-9',
                    input: 'text-sm',
                    inputWrapper: 'bg-[#f3f3f5] border-0 rounded-lg',
                  }}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                />
              )}
            />
          </div>

          {/* Course Color */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-gray-950 leading-[14px]'>
              Course Color
            </label>
            <div className='flex flex-wrap gap-3'>
              {PRESET_COLORS.slice(0, 12).map(color => (
                <button
                  key={color}
                  type='button'
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 rounded-[10px] transition-all ${
                    selectedColor === color
                      ? 'ring-4 ring-white ring-offset-2 ring-offset-gray-900'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
              {/* Custom color picker */}
              <div className='relative'>
                <input
                  type='color'
                  value={selectedColor}
                  onChange={e => handleColorSelect(e.target.value)}
                  className='w-10 h-10 rounded-[10px] border-2 border-gray-300 cursor-pointer opacity-0 absolute inset-0'
                  aria-label='Custom color picker'
                />
                <div className='w-10 h-10 rounded-[10px] border-2 border-gray-300 flex items-center justify-center pointer-events-none'>
                  <svg
                    className='w-5 h-5 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <BaseButton
          type='submit'
          isValid={isValid}
          isLoading={isPending}
          content='Add'
          startContent={!isPending && <Plus className='w-4 h-4' />}
        />
      </form>
    </div>
  );
};
