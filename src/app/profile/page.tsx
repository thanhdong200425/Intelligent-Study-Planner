'use client';

import React, { useEffect, useState } from 'react';

import SidebarNav from '@/components/layout/SidebarNav';
import HeaderBar from '@/components/layout/HeaderBar';
import {
  ProfileDetails,
  StudyPreferences,
  NotificationSettings,
  ProfileStats,
} from '@/components/home';

import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { getProfile, type UpdateUserRequest } from '@/services/user';
import { useUpdateProfileMutation } from '@/mutations/user';
import type { UserProfile } from '../../types';
import { da } from 'date-fns/locale';

const ProfilePage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getProfile,
  });

  const { register, reset, getValues, setValue } = useForm<UserProfile>({
    defaultValues: {
      avatar: data?.avatar || null,
      name: data?.name || '',
      email: data?.email || '',
      location: '',
      bio: '',
      focusDuration: 25,
      breakDuration: 5,
      dailyGoal: 4,
    },
  });

  const [soundEffects, setSoundEffects] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  useEffect(() => {
    if (!data) return;

    const savedLocation = localStorage.getItem('user_profile_location') || '';
    const savedBio = localStorage.getItem('user_profile_bio') || '';

    reset({
      avatar: data.avatar || null,
      name: data.name || '',
      email: data.email || '',
      location: savedLocation,
      bio: savedBio,
    });
    // eslint-disable-next-line
  }, [data]);

  const { mutate: updateProfile } = useUpdateProfileMutation({});

  const onSubmit = (values: UserProfile) => {
    const updateData: UpdateUserRequest = {
      name: values.name,
      email: values.email,
    };

    updateProfile(updateData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile.</div>;
  }

  const locationValue = getValues('location');
  const bioValue = getValues('bio');
  const nameValue = getValues('name');
  const emailValue = getValues('email');

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <SidebarNav />

      <main className='flex-1 overflow-y-auto'>
        <HeaderBar
          title='Profile'
          description='Manage your account and preferences'
          isShowSearchBar={false}
          isShowNotification={true}
        />

        <div className='px-8 py-6 max-w-4xl mx-auto space-y-6'>
          <ProfileDetails
            register={register}
            name={nameValue}
            email={emailValue}
            location={locationValue}
            joinedDate={data?.createdAt || ''}
          />

          <StudyPreferences
            register={register}
            soundEffects={soundEffects}
            onSoundEffectsChange={setSoundEffects}
          />

          <NotificationSettings
            emailNotifications={emailNotifications}
            pushNotifications={pushNotifications}
            weeklyReport={weeklyReport}
            onEmailChange={setEmailNotifications}
            onPushChange={setPushNotifications}
            onWeeklyReportChange={setWeeklyReport}
          />

          <ProfileStats />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
