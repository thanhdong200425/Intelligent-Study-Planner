'use client';

import React from 'react';
import { Task, TaskType, TaskPriority } from '@/types';
import { Controller, useForm } from 'react-hook-form';
import { Input, Select, SelectItem, Button, addToast } from '@heroui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses } from '@/services/courseApi';
import apiClient from '@/lib/api';
import { X } from 'lucide-react';

interface TaskFormProps {
  onSubmit?: (task: Task) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const getTaskTypeEmoji = (type: TaskType): string => {
  switch (type) {
    case 'reading':
      return '📖';
    case 'coding':
      return '💻';
    case 'writing':
      return '✍️';
    case 'pset':
      return '📝';
    default:
      return '📋';
  }
};

const getTaskTypeLabel = (type: TaskType): string => {
  switch (type) {
    case 'reading':
      return 'Reading';
    case 'coding':
      return 'Coding';
    case 'writing':
      return 'Writing';
    case 'pset':
      return 'Pset';
    default:
      return 'Task';
  }
};

const taskTypes: TaskType[] = ['reading', 'coding', 'writing', 'pset'];
const priorities: TaskPriority[] = ['low', 'medium', 'high'];

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, onClose }) => {
  const queryClient = useQueryClient();
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Partial<Task>>({
    defaultValues: {
      title: '',
      courseId: '',
      type: 'reading',
      priority: 'medium',
      estimateMinutes: 60,
    },
    mode: 'onSubmit',
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const response = await apiClient.post('/tasks', {
        title: data.title,
        courseId: parseInt(data.courseId as string),
        type: data.type,
        priority: data.priority,
        estimateMinutes: data.estimateMinutes,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast({
        title: 'Task added successfully',
        color: 'success',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      reset({
        title: '',
        courseId: '',
        type: 'reading',
        priority: 'medium',
        estimateMinutes: 60,
      });
      onSubmit?.(data);
    },
    onError: error => {
      console.error('Failed to create task:', error);
      addToast({
        title: 'Failed to add task',
        color: 'danger',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const onSubmitHandler = (data: Partial<Task>) => {
    createTaskMutation.mutate(data);
  };

  return (
    <div className='bg-white  relative rounded-[10px] w-full py-2'>
      {/* Close Button */}
      {onClose && (
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 opacity-70 hover:opacity-100 transition-opacity rounded-sm w-4 h-4 flex items-center justify-center'
          aria-label='Close'
        >
          <X className='w-4 h-4 text-neutral-950' />
        </button>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmitHandler)} className='px-6 pb-6'>
        <div className='flex flex-col gap-4'>
          {/* Task Title */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-950 leading-3.5'>
              Task Title *
            </label>
            <Controller
              control={control}
              name='title'
              rules={{
                required: {
                  value: true,
                  message: 'Task title is required',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Enter task title'
                  className='w-full'
                  classNames={{
                    input: 'text-sm text-[#717182]',
                    inputWrapper:
                      'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                  }}
                  errorMessage={errors.title?.message}
                  isInvalid={!!errors.title}
                />
              )}
            />
          </div>

          {/* Course */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-950 leading-[14px]'>
              Course *
            </label>
            <Controller
              control={control}
              name='courseId'
              rules={{
                required: {
                  value: true,
                  message: 'Course is required',
                },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder='Select a course'
                  className='w-full'
                  selectedKeys={field.value ? [field.value.toString()] : []}
                  onSelectionChange={keys => {
                    const selected = Array.from(keys)[0];
                    field.onChange(selected?.toString() || '');
                  }}
                  classNames={{
                    trigger:
                      'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                    value: 'text-sm text-[#717182]',
                  }}
                  errorMessage={errors.courseId?.message}
                  isInvalid={!!errors.courseId}
                >
                  {courses.map(course => (
                    <SelectItem key={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>

          {/* Task Type and Priority Row */}
          <div className='flex gap-4'>
            {/* Task Type */}
            <div className='flex flex-col gap-2 flex-1'>
              <label className='text-sm text-neutral-950 leading-[14px]'>
                Task Type
              </label>
              <Controller
                control={control}
                name='type'
                render={({ field }) => (
                  <Select
                    {...field}
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={keys => {
                      const selected = Array.from(keys)[0] as TaskType;
                      field.onChange(selected || 'reading');
                    }}
                    className='w-full'
                    classNames={{
                      trigger:
                        'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                      value: 'text-sm text-neutral-950',
                    }}
                  >
                    {taskTypes.map(type => (
                      <SelectItem key={type}>
                        {getTaskTypeEmoji(type)} {getTaskTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>

            {/* Priority */}
            <div className='flex flex-col gap-2 flex-1'>
              <label className='text-sm text-neutral-950 leading-[14px]'>
                Priority
              </label>
              <Controller
                control={control}
                name='priority'
                render={({ field }) => (
                  <Select
                    {...field}
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={keys => {
                      const selected = Array.from(keys)[0] as TaskPriority;
                      field.onChange(selected || 'medium');
                    }}
                    className='w-full'
                    classNames={{
                      trigger:
                        'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                      value: 'text-sm text-neutral-950',
                    }}
                  >
                    {priorities.map(priority => (
                      <SelectItem key={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Estimated Time */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-950 leading-[14px]'>
              Estimated Time (minutes)
            </label>
            <Controller
              control={control}
              name='estimateMinutes'
              rules={{
                required: {
                  value: true,
                  message: 'Estimated time is required',
                },
                min: {
                  value: 1,
                  message: 'Estimated time must be at least 1 minute',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type='number'
                  value={field.value?.toString() || ''}
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  className='w-full'
                  classNames={{
                    input: 'text-sm text-neutral-950',
                    inputWrapper:
                      'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                  }}
                  errorMessage={errors.estimateMinutes?.message}
                  isInvalid={!!errors.estimateMinutes}
                />
              )}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className='flex gap-2 justify-end mt-8'>
          {onCancel && (
            <Button
              type='button'
              onPress={onCancel}
              variant='bordered'
              className='bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[8px] h-[36px] px-4 min-w-[75px]'
            >
              <span className='text-sm text-neutral-950'>Cancel</span>
            </Button>
          )}
          <Button
            type='submit'
            isLoading={createTaskMutation.isPending}
            className='bg-[#101828] text-white rounded-[8px] h-[36px] px-4 min-w-[89px]'
          >
            <span className='text-sm text-white'>Add Task</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
