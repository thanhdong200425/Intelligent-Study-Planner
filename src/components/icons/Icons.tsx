import React from 'react';

export const TimeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-6 w-6'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);

export const BookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-6 w-6'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 6v13'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 6v13'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M21 6v13'
    />
  </svg>
);

export const HabitsIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    />
  </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    />
  </svg>
);

export const PlannerIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    />
  </svg>
);

export const TasksIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
    />
  </svg>
);

export const AnalyticsIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    />
  </svg>
);
export const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-5 w-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M15 19l-7-7 7-7'
    />
  </svg>
);

export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-6 w-6 text-gray-500'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
    />
  </svg>
);
export const ProfileIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    />
  </svg>
);

export const SessionIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);

export const CoursesIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    />
  </svg>
);

export const CollapseIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
  </svg>
);
export const SearchIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    />
  </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      d='M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z'
      clipRule='evenodd'
    />
  </svg>
);

export const LocationIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
      clipRule='evenodd'
    />
  </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
    <path
      fillRule='evenodd'
      d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
      clipRule='evenodd'
    />
  </svg>
);
