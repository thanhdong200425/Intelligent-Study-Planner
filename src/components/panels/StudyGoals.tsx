'use client';
import { Card, CardHeader, CardBody, Progress } from '@heroui/react';
import { BookOpenCheck, GraduationCap, CheckSquare } from 'lucide-react';

function GoalRow({
  icon,
  title,
  subtitle,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: number;
}) {
  return (
    <div className='border border-gray-200 rounded-xl p-4'>
      <div className='flex items-start gap-3'>
        <div className='rounded-lg p-2 bg-blue-100 text-blue-700'>{icon}</div>
        <div className='flex-1'>
          <p className='text-sm text-gray-900'>{title}</p>
          <p className='text-sm text-gray-500'>{subtitle}</p>
        </div>
        <p className='text-sm text-gray-900 w-10 text-right'>{value}%</p>
      </div>
      <Progress
        aria-label={`${title} progress`}
        value={value}
        className='mt-3'
      />
    </div>
  );
}

export default function StudyGoals() {
  return (
    <Card className='rounded-2xl'>
      <CardHeader className='px-6 pt-6 pb-0 flex items-center justify-between'>
        <h3 className='text-base text-gray-900'>Study Goals</h3>
        <span className='text-sm text-gray-900'>View All</span>
      </CardHeader>
      <CardBody className='px-6 pb-6 pt-4 space-y-4'>
        <GoalRow
          icon={<BookOpenCheck className='size-5' />}
          title='Weekly Study Hours'
          subtitle='32 / 40 hours'
          value={80}
        />
        <GoalRow
          icon={<GraduationCap className='size-5' />}
          title='Course Completion'
          subtitle='6 / 8 courses'
          value={75}
        />
        <GoalRow
          icon={<CheckSquare className='size-5' />}
          title='Assignment Success'
          subtitle='15 / 20 completed'
          value={75}
        />
      </CardBody>
    </Card>
  );
}
