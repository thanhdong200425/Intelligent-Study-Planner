'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Deadline, Course } from '@/types';
import { DeadlineStorage, CourseStorage } from '@/lib/storage';
import { Controller, useForm } from 'react-hook-form';
import {
  DatePicker,
  Input,
  Select,
  SelectItem,
  Button,
  addToast,
} from '@heroui/react';
import { parseDateTime } from '@internationalized/date';

interface DeadlineFormProps {
  onSubmit?: (deadline: Deadline) => void;
  onCancel?: () => void;
}

// Helper function to format date in local timezone for parseDateTime
const formatDateForPicker = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const DeadlineForm: React.FC<DeadlineFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const {
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Deadline>({
    defaultValues: {
      title: '',
      courseId: '',
      dueDate: undefined,
      priority: 'medium' as 'low' | 'medium' | 'high',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    const loadCourses = () => {
      const allCourses = CourseStorage.getAll();
      setCourses(allCourses);
      if (allCourses.length > 0 && !watch('courseId')) {
        // setValue('courseId', allCourses[0].id);
      }
    };

    loadCourses();
  }, [setValue, watch]);

  const onSubmitHandler = (data: Deadline) => {
    const deadline: Deadline = {
      id: uuidv4(),
      title: data.title.trim(),
      courseId: data.courseId,
      dueDate: new Date(data.dueDate),
      priority: data.priority,
    };

    DeadlineStorage.add(deadline);
    onSubmit?.(deadline);

    addToast({
      title: 'Deadline Added',
      color: 'success',
      timeout: 3000,
      shouldShowTimeoutProgress: true,
    });

    // Reset form
    // reset({
    //   title: '',
    //   courseId: courses[0]?.id || '',
    //   dueDate: undefined,
    //   priority: 'medium',
    // });
  };

  if (courses.length === 0) {
    return (
      <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
        <p className='text-yellow-800'>
          Please add at least one course before creating deadlines.
        </p>
      </div>
    );
  }

  const courseOptions = courses.map(course => ({
    value: course.id,
    label: course.name,
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className='space-y-4'>
      <Controller
        control={control}
        name='title'
        rules={{
          required: {
            value: true,
            message: 'Deadline title is required',
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            label='Deadline Title'
            isInvalid={!!errors.title?.message}
            errorMessage={errors.title?.message}
            size='sm'
          />
        )}
      />

      <Controller
        control={control}
        name='courseId'
        rules={{ required: { value: true, message: 'Course is required' } }}
        render={({ ...field }) => (
          <Select
            {...field}
            isInvalid={!!errors.courseId?.message}
            placeholder='Select a course'
            errorMessage={errors.courseId?.message}
            label='Course'
          >
            {courseOptions.map(course => (
              <SelectItem key={course.value}>{course.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name='priority'
        rules={{ required: { value: true, message: 'Priority is required' } }}
        render={({ ...field }) => (
          <Select
            {...field}
            isInvalid={!!errors.priority?.message}
            placeholder='Select priority'
            errorMessage={errors.priority?.message}
            label='Priority'
          >
            {priorityOptions.map(priority => (
              <SelectItem key={priority.value}>{priority.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name='dueDate'
        rules={{
          required: {
            value: true,
            message: 'Due date is required',
          },
        }}
        render={({ field }) => (
          <DatePicker
            {...field}
            hideTimeZone
            showMonthAndYearPickers
            label='Due Date'
            value={
              field.value
                ? parseDateTime(formatDateForPicker(new Date(field.value)))
                : null
            }
            granularity='minute'
            hourCycle={24}
            isInvalid={!!errors?.dueDate?.message}
            errorMessage={errors?.dueDate?.message}
          />
        )}
      />

      <div className='flex gap-2'>
        <Button type='submit' color='primary'>
          Add Deadline
        </Button>
        {onCancel && (
          <Button type='button' color='secondary' onPress={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
