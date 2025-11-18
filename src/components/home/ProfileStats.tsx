import React from 'react';

interface StatItemProps {
  value: string | number;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className='bg-gray-50 rounded-lg p-4 text-center'>
    <p className='text-2xl font-normal text-gray-900 mb-1'>{value}</p>
    <p className='text-sm text-gray-600'>{label}</p>
  </div>
);

interface ProfileStatsProps {
  studyHours?: number;
  courses?: number;
  avgScore?: string;
  streakDays?: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  studyHours = 156,
  courses = 12,
  avgScore = '89%',
  streakDays = 47,
}) => {
  return (
    <div className='bg-white border border-gray-200 rounded-[14px] p-6'>
      <h3 className='text-base font-normal text-gray-900 mb-6'>Your Stats</h3>

      <div className='grid grid-cols-4 gap-4'>
        <StatItem value={studyHours} label='Study Hours' />
        <StatItem value={courses} label='Courses' />
        <StatItem value={avgScore} label='Avg Score' />
        <StatItem value={streakDays} label='Streak Days' />
      </div>
    </div>
  );
};

export default ProfileStats;

