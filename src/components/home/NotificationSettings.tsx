'use client';

import React from 'react';
import { Switch } from '@heroui/react';

interface NotificationToggleProps {
  title: string;
  description: string;
  isSelected: boolean;
  onValueChange: (value: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  description,
  isSelected,
  onValueChange,
}) => (
  <div className='flex items-center justify-between'>
    <div>
      <p className='text-sm font-normal text-gray-900'>{title}</p>
      <p className='text-sm text-gray-600'>{description}</p>
    </div>
    <Switch
      isSelected={isSelected}
      onValueChange={onValueChange}
      size='sm'
      classNames={{
        wrapper: 'bg-gray-900',
      }}
    />
  </div>
);

interface NotificationSettingsProps {
  emailNotifications: boolean;
  weeklyReport: boolean;
  onEmailChange: (value: boolean) => void;
  onWeeklyReportChange: (value: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  emailNotifications,
  weeklyReport,
  onEmailChange,
  onWeeklyReportChange,
}) => {
  return (
    <div className='bg-white border border-gray-200 rounded-[14px] p-6'>
      <h3 className='text-base font-normal text-gray-900 mb-2'>
        Notifications
      </h3>
      <p className='text-sm text-gray-600 mb-6'>
        Choose how you want to receive updates and reminders
      </p>

      <div className='space-y-4'>
        <NotificationToggle
          title='Email Notifications'
          description='Receive study reminders and updates via email'
          isSelected={emailNotifications}
          onValueChange={onEmailChange}
        />

        <div className='h-px bg-gray-200' />

        <div className='h-px bg-gray-200' />

        <NotificationToggle
          title='Weekly Progress Report'
          description='Receive a summary of your weekly achievements'
          isSelected={weeklyReport}
          onValueChange={onWeeklyReportChange}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
