'use client';

import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  addToast,
} from '@heroui/react';
import { Send, Upload, X } from 'lucide-react';
import SidebarNav from '@/components/layout/SidebarNav';
import HeaderBar from '@/components/layout/HeaderBar';
import { useCreateFeedbackMutation } from '@/mutations/feedback';

interface FeedbackFormData {
  feedbackType: string;
  category: string;
  subject: string;
  message: string;
}

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'improvement', label: 'Improvement Suggestion' },
  { value: 'general', label: 'General Feedback' },
];

const CATEGORIES = [
  { value: 'ui', label: 'User Interface' },
  { value: 'performance', label: 'Performance' },
  { value: 'calendar', label: 'Calendar & Planning' },
  { value: 'tasks', label: 'Tasks & To-Do' },
  { value: 'focus', label: 'Focus Sessions' },
  { value: 'courses', label: 'Courses' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'other', label: 'Other' },
];

const FeedbackPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      feedbackType: '',
      category: '',
      subject: '',
      message: '',
    },
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const message = watch('message') || '';

  const { mutate: submitFeedback, isPending } = useCreateFeedbackMutation();

  const onSubmit = (data: FeedbackFormData) => {
    if (!data.feedbackType) {
      addToast({
        title: 'Please select a feedback type',
        color: 'warning',
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      return;
    }

    submitFeedback(
      {
        feedbackType: data.feedbackType,
        category: data.category,
        subject: data.subject,
        message: data.message,
        attachments,
      },
      {
        onSuccess: () => {
          reset();
          setAttachments([]);
        },
      }
    );
  };

  const handleClearForm = () => {
    reset();
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        addToast({
          title: `File ${file.name} exceeds 10MB limit`,
          color: 'warning',
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
        return;
      }

      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        addToast({
          title: `File ${file.name} is not a valid type (PNG, JPG, PDF only)`,
          color: 'warning',
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
        return;
      }

      validFiles.push(file);
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <SidebarNav />

      <main className='flex-1 overflow-y-auto'>
        <HeaderBar
          title='Share Your Feedback'
          description='Help us improve your learning experience. Your feedback matters to us.'
          isShowSearchBar={false}
          isShowNotification={false}
        />

        <div className='px-8 py-6 max-w-4xl mx-auto'>
          <div className='bg-white border border-gray-200 rounded-2xl p-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Feedback Type */}
              <div className='space-y-2'>
                <label className='block text-sm text-[#0a0a0a]'>
                  Feedback Type <span className='text-red-500'>*</span>
                </label>
                <Controller
                  name='feedbackType'
                  control={control}
                  rules={{ required: 'Feedback type is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder='Select feedback type'
                      classNames={{
                        trigger: 'bg-[#f3f3f5] border-transparent h-[36px]',
                        value: 'text-sm',
                      }}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={keys => {
                        const value = Array.from(keys)[0] as string;
                        field.onChange(value);
                      }}
                    >
                      {FEEDBACK_TYPES.map(type => (
                        <SelectItem key={type.value}>{type.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.feedbackType && (
                  <p className='text-xs text-red-500'>
                    {errors.feedbackType.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className='space-y-2'>
                <label className='block text-sm text-[#0a0a0a]'>Category</label>
                <Controller
                  name='category'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder='Select a category'
                      classNames={{
                        trigger: 'bg-[#f3f3f5] border-transparent h-[36px]',
                        value: 'text-sm',
                      }}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={keys => {
                        const value = Array.from(keys)[0] as string;
                        field.onChange(value);
                      }}
                    >
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>

              {/* Subject */}
              <div className='space-y-2'>
                <label className='block text-sm text-[#0a0a0a]'>
                  Subject <span className='text-red-500'>*</span>
                </label>
                <Controller
                  name='subject'
                  control={control}
                  rules={{ required: 'Subject is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Brief summary of your feedback'
                      classNames={{
                        inputWrapper:
                          'bg-[#f3f3f5] border-transparent h-[36px]',
                        input: 'text-sm',
                      }}
                    />
                  )}
                />
                {errors.subject && (
                  <p className='text-xs text-red-500'>
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className='space-y-2'>
                <label className='block text-sm text-[#0a0a0a]'>
                  Message <span className='text-red-500'>*</span>
                </label>
                <Controller
                  name='message'
                  control={control}
                  rules={{ required: 'Message is required' }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder='Please provide detailed information about your feedback...'
                      minRows={3}
                      classNames={{
                        inputWrapper: 'bg-[#f3f3f5] border-transparent',
                        input: 'text-sm',
                      }}
                    />
                  )}
                />
                <p className='text-xs text-[#6a7282]'>
                  {message.length} characters
                </p>
                {errors.message && (
                  <p className='text-xs text-red-500'>
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className='space-y-3'>
                <label className='block text-sm text-[#0a0a0a]'>
                  Attach screenshots or files (optional)
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className='border-2 border-dashed border-[#d1d5dc] rounded-lg p-8 cursor-pointer hover:border-[#9ca3af] transition-colors'
                >
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='image/png,image/jpeg,application/pdf'
                    onChange={handleFileSelect}
                    className='hidden'
                  />

                  <div className='flex flex-col items-center gap-2 text-center'>
                    <Upload className='size-8 text-gray-400' />
                    <p className='text-base text-[#4a5565]'>
                      Click to upload or drag and drop
                    </p>
                    <p className='text-sm text-[#6a7282]'>
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className='space-y-2'>
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2'
                      >
                        <span className='text-sm text-gray-700 truncate flex-1'>
                          {file.name}
                        </span>
                        <button
                          type='button'
                          onClick={() => removeAttachment(index)}
                          className='ml-2 text-gray-400 hover:text-red-500 transition-colors'
                        >
                          <X className='size-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-4 border-t border-gray-200'>
                <Button
                  type='button'
                  variant='bordered'
                  className='flex-1 h-[36px]'
                  onPress={handleClearForm}
                >
                  Clear Form
                </Button>
                <Button
                  type='submit'
                  className='flex-1 h-[36px] bg-[#101828] text-white'
                  isLoading={isPending}
                  startContent={!isPending && <Send className='size-4' />}
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
