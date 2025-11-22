'use client';
import { Card, CardHeader, CardBody, Button, Chip } from '@heroui/react';
import { CalendarDays, Clock3, ExternalLink } from 'lucide-react';
import { BaseButton } from '../buttons';

export default function UpcomingEvents() {
  return (
    <Card className='rounded-2xl'>
      <CardHeader className='flex items-center justify-between px-6 pt-6 pb-0'>
        <h3 className='text-base text-gray-900'>Upcoming Events</h3>
        <BaseButton className='w-auto' content='See All' />
      </CardHeader>
      <CardBody className='px-6 pb-6 pt-4 space-y-3'>
        {[
          {
            title: 'Mathematics Final Exam',
            date: 'Sep 6, 2022',
            time: '10:00 AM',
            kind: 'exam',
            color: 'danger',
          },
          {
            title: 'Research Paper Submission',
            date: 'Sep 10, 2022',
            time: '11:59 PM',
            kind: 'assignment',
            color: 'warning',
          },
          {
            title: 'UI/UX Workshop',
            date: 'Sep 12, 2022',
            time: '2:00 PM',
            kind: 'class',
            color: 'primary',
          },
          {
            title: 'Group Study Session',
            date: 'Sep 15, 2022',
            time: '4:00 PM',
            kind: 'class',
            color: 'primary',
          },
        ].map(e => (
          <div
            key={e.title}
            className='border border-gray-100 rounded-xl p-3 flex items-start gap-3'
          >
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <p className='text-sm text-gray-900'>{e.title}</p>
                <ExternalLink className='size-4 text-gray-400' />
              </div>
              <div className='flex items-center gap-4 text-sm text-gray-500 mt-1'>
                <div className='flex items-center gap-1'>
                  <CalendarDays className='size-4' /> {e.date}
                </div>
                <div className='flex items-center gap-1'>
                  <Clock3 className='size-4' /> {e.time}
                </div>
              </div>
            </div>
            <Chip
              color={e.color as any}
              variant='flat'
              size='sm'
              className='capitalize'
            >
              {e.kind}
            </Chip>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
