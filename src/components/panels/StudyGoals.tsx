'use client';
import { Card, CardHeader, CardBody, Chip } from '@heroui/react';
import { Sparkles } from 'lucide-react';

export default function StudyGoals() {
  return (
    <Card className='rounded-2xl border-dashed border-2 border-gray-200 bg-linear-to-b from-white to-gray-50'>
      <CardHeader className='px-6 pt-6 pb-0 flex items-center justify-between'>
        <h3 className='text-base text-gray-900 flex items-center gap-2'>
          <Sparkles className='size-4 text-blue-500' />
          Study Goals
        </h3>
        <Chip
          size='sm'
          variant='flat'
          className='text-xs font-medium bg-blue-50 text-blue-600 border-none'
        >
          Coming soon
        </Chip>
      </CardHeader>
      <CardBody className='px-6 pb-6 pt-4 space-y-3'>
        <p className='text-sm text-gray-600'>
          Soon you&apos;ll be able to set smart study goals, track your weekly
          focus time, and see progress across courses in one minimalist view.
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-500'>
          <div className='rounded-xl border border-gray-100 bg-white/60 px-3 py-2'>
            <p className='font-medium text-gray-900 text-xs'>
              Personalised goals
            </p>
            <p className='mt-1'>
              AI-assisted targets based on your schedule and habits.
            </p>
          </div>
          <div className='rounded-xl border border-gray-100 bg-white/60 px-3 py-2'>
            <p className='font-medium text-gray-900 text-xs'>Progress radar</p>
            <p className='mt-1'>
              Visual summaries of focus time, tasks and deadlines.
            </p>
          </div>
          <div className='rounded-xl border border-gray-100 bg-white/60 px-3 py-2'>
            <p className='font-medium text-gray-900 text-xs'>Gentle nudges</p>
            <p className='mt-1'>
              Subtle reminders to keep you on track, not stressed.
            </p>
          </div>
        </div>
        <p className='text-xs text-gray-400 mt-2'>
          We&apos;re polishing this experience based on early user feedback.
        </p>
      </CardBody>
    </Card>
  );
}
