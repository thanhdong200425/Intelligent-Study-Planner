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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
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
const timeEstimates: { key: number; label: string }[] = [
  { key: 15, label: '15m' },
  { key: 30, label: '30m' },
  { key: 45, label: '45m' },
  { key: 60, label: '1h' },
  { key: 90, label: '1.5h' },
  { key: 120, label: '2h' },
  { key: 180, label: '3h' },
  { key: 240, label: '4h' },
];

const priorityColorsClasses: { key: TaskPriority; color: string }[] = [
  { key: 'low', color: '#10B981' },
  { key: 'medium', color: '#F59E0B' },
  { key: 'high', color: '#EF4444' },
  { key: 'unknown', color: '#9CA3AF' },
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
          <Controller
            control={control}
            name='courseId'
            render={({ field }) => (
              <Dropdown placement='bottom-start'>
                <DropdownTrigger>
                  <Button
                    className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] px-4 bg-white'
                    startContent={<BookOpen className='w-5 h-5' />}
                  >
                    <span className='text-[12px] text-black'>
                      {selectedCourse?.name || 'Course'}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  items={courses}
                  selectedKeys={field.value ? [field.value.toString()] : []}
                  selectionMode='single'
                  onSelectionChange={keys => {
                    const selected = Array.from(keys)[0];
                    field.onChange(selected ? Number(selected) : undefined);
                  }}
                  classNames={{
                    base: 'w-[200px]',
                  }}
                >
                  {course => (
                    <DropdownItem key={course.id.toString()}>
                      {course.name}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            )}
          />

          {/* Type Button */}
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <Dropdown placement='bottom-start'>
                <DropdownTrigger>
                  <Button
                    className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] px-4 bg-white flex items-center justify-center'
                    startContent={
                      field.value ? (
                        <span>
                          {taskTypes.find(t => t.key === field.value)?.emoji}
                        </span>
                      ) : (
                        <Tag className='w-5 h-5' />
                      )
                    }
                  >
                    <span className='text-[12px] text-black'>
                      {taskTypes.find(t => t.key === field.value)?.label ||
                        'Type'}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  items={taskTypes}
                  selectedKeys={field.value ? [field.value] : []}
                  selectionMode='single'
                  onSelectionChange={keys => {
                    const selected = Array.from(keys)[0] as TaskType;
                    field.onChange(selected || 'reading');
                  }}
                  classNames={{
                    base: 'w-[200px]',
                  }}
                >
                  {type => (
                    <DropdownItem key={type.key}>
                      {type.emoji} {type.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            )}
          />

          {/* Priority Button */}
          <Controller
            control={control}
            name='priority'
            render={({ field }) => (
              <Dropdown placement='bottom-start'>
                <DropdownTrigger>
                  <Button
                    className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] px-4 bg-white'
                    startContent={
                      <Flag
                        className='w-5 h-5'
                        color={
                          priorityColorsClasses.find(p => p.key === field.value)
                            ?.color
                        }
                      />
                    }
                  >
                    <span className='text-[12px] text-black'>
                      {priorities.find(p => p.key === priority)?.label ||
                        'Priority'}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  items={priorities}
                  selectedKeys={field.value ? [field.value] : []}
                  selectionMode='single'
                  onSelectionChange={keys => {
                    const selected = Array.from(keys)[0] as TaskPriority;
                    field.onChange(selected || 'medium');
                  }}
                  classNames={{
                    base: 'w-[200px]',
                  }}
                >
                  {priority => (
                    <DropdownItem key={priority.key}>
                      {priority.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            )}
          />

          {/* Estimated Button */}
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
              <Dropdown placement='bottom-start'>
                <DropdownTrigger>
                  <Button
                    className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] px-4 bg-white'
                    startContent={<Clock className='w-5 h-5' />}
                  >
                    <span className='text-[12px] text-black'>
                      {estimateMinutes
                        ? timeEstimates.find(t => t.key === estimateMinutes)
                            ?.label || `${estimateMinutes}m`
                        : 'Estimated'}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  items={timeEstimates}
                  selectedKeys={field.value ? [field.value.toString()] : []}
                  selectionMode='single'
                  onSelectionChange={keys => {
                    const selected = Array.from(keys)[0];
                    field.onChange(selected ? Number(selected) : undefined);
                  }}
                  classNames={{
                    base: 'w-[200px]',
                  }}
                >
                  {timeEstimate => (
                    <DropdownItem key={timeEstimate.key.toString()}>
                      {timeEstimate.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            )}
          />

          {/* More Options Button */}
          {/* <Button
            isIconOnly
            className='border-2 border-[#d4d4d8] rounded-[8px] h-[31px] w-[40px] bg-white'
          >
            <MoreHorizontal className='w-5 h-5' />
          </Button> */}
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
