'use client';

import React, { useState } from 'react';
import { Task, TaskType, TaskPriority } from '@/types';
import { Controller, useForm } from 'react-hook-form';
import {
  Input,
  Select,
  SelectItem,
  Button,
  addToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@heroui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses } from '@/services/course';
import apiClient from '@/lib/api';
import {
  X,
  BookOpen,
  Tag,
  Flag,
  Clock,
  MoreHorizontal,
  Paperclip,
} from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTask } from '@/services';
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/mutations';
import { HeadingInput } from '../inputs';

interface TaskFormProps {
  task?: Task;
  onCancel?: () => void;
  onClose?: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  courseId: z.number().optional(),
  type: z.enum(['reading', 'coding', 'writing', 'pset', 'other']),
  estimateMinutes: z.number().min(1, 'Estimate must be at least 1 minute'),
  priority: z.enum(['low', 'medium', 'high', 'unknown']).optional(),
});

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

  type TaskFormValues = z.infer<typeof formSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      courseId: task?.courseId ? Number(task.courseId) : undefined,
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
        description: '',
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
      // Convert string id to number for backend
      const taskId = Number(task.id);
      if (isNaN(taskId)) {
        addToast({
          title: 'Invalid task ID',
          color: 'danger',
          timeout: 1000,
        });
        return;
      }
      updateTaskMutation.mutate({ taskId, data });
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
  const taskType = watch('type');
  const priority = watch('priority');
  const estimateMinutes = watch('estimateMinutes');
  const selectedCourse = courses.find(c => c.id === courseId);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className='w-full'>
      <div className='flex flex-col gap-[15px] pt-5'>
        {/* Task Name and Description */}
        <div className='flex flex-col gap-[9px]'>
          <div className='flex flex-col gap-[9px]'>
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
                <HeadingInput
                  {...field}
                  placeholder='Task name'
                  className='text-[20px]'
                  errorMessage={errors.title?.message}
                  isInvalid={!!errors.title}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-[9px]'>
            <Controller
              control={control}
              name='description'
              render={({ field }) => (
                <HeadingInput
                  {...field}
                  placeholder='Description'
                  className='text-[16px] font-normal!'
                  errorMessage={errors.description?.message}
                  isInvalid={!!errors.description}
                />
              )}
            />
          </div>
        </div>

        {/* Button Row: Course, Type, Priority, Estimated, More */}
        <div className='flex gap-[9px] items-center'>
          {/* Course Button */}
          <Popover placement='bottom-start'>
            <PopoverTrigger>
              <Button
                className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] px-4 bg-white'
                startContent={<BookOpen className='w-5 h-5' />}
              >
                <span className='text-[12px] text-black'>
                  {selectedCourse?.name || 'Course'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='p-2'>
                <Controller
                  control={control}
                  name='courseId'
                  render={({ field }) => (
                    <Select
                      items={courses}
                      placeholder='Select a course'
                      selectedKeys={field.value ? [field.value.toString()] : []}
                      onSelectionChange={keys => {
                        const selected = Array.from(keys)[0];
                        field.onChange(Number(selected) || undefined);
                      }}
                      classNames={{
                        trigger: 'w-[200px]',
                      }}
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
            </PopoverContent>
          </Popover>

          {/* Type Button */}
          <Popover placement='bottom-start'>
            <PopoverTrigger>
              <Button
                className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] px-4 bg-white'
                startContent={<Tag className='w-5 h-5' />}
              >
                <span className='text-[12px] text-black'>
                  {taskTypes.find(t => t.key === taskType)?.label || 'Type'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='p-2'>
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
                      classNames={{
                        trigger: 'w-[200px]',
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
            </PopoverContent>
          </Popover>

          {/* Priority Button */}
          <Popover placement='bottom-start'>
            <PopoverTrigger>
              <Button
                className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] px-4 bg-white'
                startContent={<Flag className='w-5 h-5' />}
              >
                <span className='text-[12px] text-black'>
                  {priorities.find(p => p.key === priority)?.label ||
                    'Priority'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='p-2'>
                <Controller
                  control={control}
                  name='priority'
                  render={({ field }) => (
                    <Select
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={keys => {
                        const selected = Array.from(keys)[0] as TaskPriority;
                        field.onChange(selected || 'medium');
                      }}
                      classNames={{
                        trigger: 'w-[200px]',
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
            </PopoverContent>
          </Popover>

          {/* Estimated Button */}
          <Popover placement='bottom-start'>
            <PopoverTrigger>
              <Button
                className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] px-4 bg-white'
                startContent={<Clock className='w-5 h-5' />}
              >
                <span className='text-[12px] text-black'>
                  {estimateMinutes ? `${estimateMinutes}m` : 'Estimated'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='p-2'>
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
                      type='number'
                      placeholder='Minutes'
                      value={field.value?.toString() || ''}
                      onChange={e =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      className='w-[200px]'
                      classNames={{
                        input: 'text-sm',
                        inputWrapper: 'border-2 border-[#d4d4d8] rounded-[8px]',
                      }}
                      errorMessage={errors.estimateMinutes?.message}
                      isInvalid={!!errors.estimateMinutes}
                    />
                  )}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* More Options Button */}
          <Button
            isIconOnly
            className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] w-[40px] bg-white'
          >
            <MoreHorizontal className='w-5 h-5' />
          </Button>
        </div>

        {/* Divider */}
        <div className='w-full h-px bg-[rgba(17,17,17,0.15)]' />

        {/* Footer: Paperclip, Cancel, Add Task */}
        <div className='flex items-center justify-between'>
          <Button
            isIconOnly
            className='rounded-[12px] w-[40px] h-[40px] bg-transparent'
          >
            <Paperclip className='w-5 h-5' />
          </Button>

          <div className='flex gap-[11px] items-center'>
            <Button
              type='button'
              onPress={onCancel || onClose}
              className='bg-[rgba(212,212,216,0.4)] rounded-[12px] h-[40px] px-4'
            >
              <span className='text-[14px] text-black'>Cancel</span>
            </Button>
            <Button
              type='submit'
              isLoading={isSubmitting}
              isDisabled={!isDirty || isSubmitting}
              className='bg-[#101828] rounded-[12px] h-[40px] px-4'
            >
              <span className='text-[14px] text-white'>
                {isEditMode ? 'Update Task' : 'Add Task'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export type TaskFormData = z.infer<typeof formSchema>;
export default TaskForm;
