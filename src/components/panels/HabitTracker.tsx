import { Card, CardHeader, CardBody } from '@heroui/react';

const days = [
  { k: 'M' },
  { k: 'T' },
  { k: 'W' },
  { k: 'T' },
  { k: 'F' },
  { k: 'S' },
  { k: 'S' },
];

function HabitCard({
  icon,
  title,
  streak,
  pattern,
}: {
  icon: string;
  title: string;
  streak: string;
  pattern: boolean[];
}) {
  return (
    <div className='border border-gray-200 rounded-xl p-4'>
      <div className='flex items-center gap-3'>
        <div className='text-2xl' aria-hidden>
          {icon}
        </div>
        <div className='flex-1'>
          <p className='text-sm text-gray-900'>{title}</p>
          <p className='text-sm text-gray-500'>{streak}</p>
        </div>
      </div>
      <div className='mt-4 flex items-center gap-2'>
        {days.map((d, i) => (
          <div key={i} className='w-8'>
            <div className='text-[12px] text-gray-500 text-center mb-1'>
              {d.k}
            </div>
            <div
              className={`h-8 rounded-lg ${pattern[i] ? 'bg-black text-white flex items-center justify-center' : 'border-2 border-gray-200'}`}
            >
              {pattern[i] ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HabitTracker() {
  return (
    <Card className='rounded-2xl'>
      <CardHeader className='px-6 pt-6 pb-0 flex items-center justify-between'>
        <h3 className='text-base text-gray-900'>Habit Tracker</h3>
        <span className='text-sm text-gray-900'>+ Add Habit</span>
      </CardHeader>
      <CardBody className='px-6 pb-6 pt-4 space-y-4'>
        <HabitCard
          icon='📚'
          title='Study 2 hours'
          streak='🔥 7 day streak'
          pattern={[true, true, true, false, true, true, true]}
        />
        <HabitCard
          icon='💪'
          title='Exercise'
          streak='🔥 3 day streak'
          pattern={[true, false, true, false, false, true, true]}
        />
        <HabitCard
          icon='📖'
          title='Read 30 min'
          streak='🔥 5 day streak'
          pattern={[true, true, true, true, false, true, true]}
        />
        <HabitCard
          icon='🧘'
          title='Meditation'
          streak='🔥 12 day streak'
          pattern={[true, true, true, true, true, true, true]}
        />
      </CardBody>
    </Card>
  );
}
