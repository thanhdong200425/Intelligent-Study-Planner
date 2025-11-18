'use client';

import React from 'react';
import { Task, TaskType, TaskPriority } from '@/types';
import { Controller, useForm } from 'react-hook-form';
import { Input, Select, SelectItem, Button, addToast } from '@heroui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses } from '@/services/course';
import apiClient from '@/lib/api';
import { X } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTask } from '@/services';
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/mutations';

interface TaskFormProps {
  task?: Task;
  onCancel?: () => void;
  onClose?: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  courseId: z.number().optional(),
  type: z.enum(['reading', 'coding', 'writing', 'pset', 'other']),
  estimateMinutes: z.number().min(1, 'Estimate must be at least 1 minute'),
  priority: z.enum(['low', 'medium', 'high', 'unknown']).optional(),
});

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

const taskTypes: { key: TaskType; label: string; emoji: string }[] = [
  { key: 'reading', label: 'Reading', emoji: '📖' },
  { key: 'coding', label: 'Coding', emoji: '💻' },
  { key: 'writing', label: 'Writing', emoji: '✍️' },
  { key: 'pset', label: 'Pset', emoji: '📝' },
  { key: 'other', label: 'Other', emoji: '📋' },
];
const priorities: { key: TaskPriority; label: string }[] = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
  { key: 'unknown', label: 'Unknown' },
];

const TaskForm: React.FC<TaskFormProps> = ({ task, onCancel, onClose }) => {
  const isEditMode = !!task;
  const queryClient = useQueryClient();
  const { data: courses = [], isPending } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<Task>({
    defaultValues: {
      title: task?.title || '',
      courseId: task?.courseId,
      type: task?.type || 'reading',
      priority: task?.priority || 'medium',
      estimateMinutes: task?.estimateMinutes || 60,
    },
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
  });

  const createTaskMutation = useCreateTaskMutation({
    onSuccess: () => {
      reset({
        title: '',
        courseId: undefined,
        type: 'coding',
        priority: 'low',
        estimateMinutes: 60,
      });
      onClose?.();
    },
  });

  const updateTaskMutation = useUpdateTaskMutation({
    onSuccess: () => {
      onClose?.();
    },
  });

  const onSubmitHandler = (data: TaskFormData) => {
    if (isEditMode && task?.id) {
      updateTaskMutation.mutate({ taskId: task.id, data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  const isSubmitting =
    createTaskMutation.isPending || updateTaskMutation.isPending;

  if (isPending) {
    return <div>Loading...</div>;
  }

  const courseId = watch('courseId');

  return (
    <div className='bg-white  relative rounded-[10px] w-full py-2'>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmitHandler)} className='px-6 pb-6'>
        <div className='flex flex-col gap-4'>
          {/* Task Title */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-950 leading-3.5'>
              Task Title
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
                  required
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
              Course
            </label>
            <Controller
              control={control}
              name='courseId'
              render={({ field }) => (
                <Select
                  items={courses}
                  placeholder='Select a course'
                  isClearable
                  className='w-full'
                  selectedKeys={field.value ? [field.value.toString()] : []}
                  onSelectionChange={keys => {
                    const selected = Array.from(keys)[0];
                    field.onChange(Number(selected) || undefined);
                  }}
                  classNames={{
                    trigger:
                      'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                    value: 'text-sm text-[#717182]',
                  }}
                  errorMessage={errors.courseId?.message}
                  isInvalid={!!errors.courseId}
                >
                  {course => (
                    <SelectItem key={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  )}
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
                    items={taskTypes}
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={keys => {
                      const selected = Array.from(keys)[0] as TaskType;
                      field.onChange(selected || 'reading');
                    }}
                    className='w-full'
                    isClearable={true}
                    classNames={{
                      trigger:
                        'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                      value: 'text-sm text-neutral-950',
                    }}
                    renderValue={items => {
                      return items.map(item => {
                        const taskType = taskTypes.find(
                          t => t.key === item.data?.key
                        );
                        return (
                          <div
                            key={item.key}
                            className='flex items-center gap-2'
                          >
                            <span className='text-sm text-neutral-950'>
                              {taskType?.emoji}
                            </span>
                            <span className='text-sm text-neutral-950'>
                              {taskType?.label}
                            </span>
                          </div>
                        );
                      });
                    }}
                  >
                    {type => (
                      <SelectItem key={type.key}>
                        {type.emoji} {type.label}
                      </SelectItem>
                    )}
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
                      <SelectItem key={priority.key}>
                        {priority.label}
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
          <Button
            type='submit'
            isLoading={isSubmitting}
            isDisabled={!isDirty || isSubmitting}
            className='bg-[#101828] text-white rounded-[8px] h-[36px] px-4 min-w-[89px]'
          >
            <span className='text-sm text-white'>
              {isEditMode ? 'Update Task' : 'Add Task'}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export type TaskFormData = z.infer<typeof formSchema>;
export default TaskForm;
