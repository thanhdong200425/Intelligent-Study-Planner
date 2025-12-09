import React from 'react';
import { Card } from '@heroui/react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface AnalyticsStatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  badge?: {
    text: string;
    variant: 'success' | 'neutral';
    showIcon?: boolean;
  };
}

export const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({
  icon: Icon,
  title,
  value,
  badge,
}) => {
  return (
    <Card className='p-6 shadow-sm'>
      {/* Header with icon and badge */}
      <div className='flex items-center justify-between mb-8'>
        <div className='w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center'>
          <Icon className='w-6 h-6 text-blue-600' />
        </div>
        {badge && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              badge.variant === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {badge.showIcon && <TrendingUp className='w-3 h-3' />}
            {badge.text}
          </div>
        )}
      </div>

      {/* Value */}
      <div className='mb-4'>
        <p className='text-3xl font-bold text-gray-900'>{value}</p>
      </div>

      {/* Title */}
      <div>
        <p className='text-sm text-gray-500'>{title}</p>
      </div>
    </Card>
  );
};
