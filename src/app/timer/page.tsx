'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Timer } from '@/components/timer/Timer';
import { TimeBlockStorage } from '@/lib/storage';
import { TimeBlock } from '@/types';

function TimerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const timeBlockId = searchParams.get('timeBlockId');

  const timeBlock: TimeBlock | undefined = timeBlockId
    ? TimeBlockStorage.getAll().find(tb => tb.id === timeBlockId)
    : undefined;

  const handleComplete = (actualMinutes: number) => {
    if (timeBlock) {
      const updatedBlock = { ...timeBlock, actualMinutes, completed: true };
      TimeBlockStorage.update(updatedBlock);
    }
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='mb-6'>
          <button
            onClick={handleCancel}
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-6'>
          <Timer
            timeBlock={timeBlock}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

export default function TimerPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-gray-50 py-8' />}>
      <TimerContent />
    </Suspense>
  );
}
