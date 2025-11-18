'use client';

import React, { useEffect } from 'react';

import Sidebar from '../../components/home/Sidebar';
import ProfileHeader from '../../components/home/ProfileHeader';
import ProfileDetails from '../../components/home/ProfileDetails';
import StudyPreferences from '../../components/home/StudyPreference';

import { useForm } from 'react-hook-form';
import { addToast, Button } from '@heroui/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import UserApiService, { type UpdateUserRequest } from '@/services/user';
import type { UserProfile } from '../../types';

const App: React.FC = () => {
  /** react-hook-form **/
  const { register, control, setValue, handleSubmit, reset, watch } =
    useForm<UserProfile>({
      defaultValues: {
        fullName: '',
        email: '',
        location: '',
        bio: '',
        focusDuration: 25,
        breakDuration: 5,
        dailyGoal: 4,
        joinedDate: '',
        createdAt: '',
        updatedAt: '',
      },
    });

  /**Fetch user profile**/
  const profileQuery = useQuery({
    queryKey: ['userProfile'],
    queryFn: UserApiService.getProfile,
  });

  /**Đồng bộ dữ liệu API vào form khi fetch thành công**/
  useEffect(() => {
    if (!profileQuery.data) return;

    const savedLocation =
      typeof window !== 'undefined'
        ? localStorage.getItem('user_profile_location') || ''
        : '';

    const savedBio =
      typeof window !== 'undefined'
        ? localStorage.getItem('user_profile_bio') || ''
        : '';

    const d = profileQuery.data;

    reset({
      fullName: d.fullName || '',
      email: d.email || d.email || '',
      location: savedLocation,
      bio: savedBio,
      focusDuration: d.focusDuration ?? 25,
      breakDuration: d.breakDuration ?? 5,
      dailyGoal: d.dailyGoal ?? 4,
      joinedDate: d.createdAt
        ? `Tham gia ${new Date(d.createdAt).toLocaleDateString('vi-VN', {
            month: 'short',
            year: 'numeric',
          })}`
        : '',
      createdAt: d.createdAt ?? '',
      updatedAt: d.updatedAt ?? '',
    });
  }, [profileQuery.data, reset]);

  /** Mutation cập nhật user (React Query)**/
  const updateMutation = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: async (payload: UpdateUserRequest) =>
      UserApiService.updateProfile(payload),

    onSuccess: () => {
      addToast({
        title: 'Information saved successfully!',
        color: 'success',
        timeout: 2000,
      });
    },

    onError: () => {
      addToast({
        title: 'Update failed. Please try again.',
        color: 'danger',
      });
    },
  });

  /**Submit cập nhật thông tin**/
  const onSubmit = (values: UserProfile) => {
    const updateData: UpdateUserRequest = {
      fullName: values.fullName,
      email: values.email,
    };

    updateMutation.mutate(updateData);
  };

  /**Lưu location + bio tạm vào localStorage**/
  const watchLocation = watch('location');
  const watchBio = watch('bio');

  useEffect(() => {
    if (watchLocation !== undefined) {
      localStorage.setItem('user_profile_location', watchLocation);
    }
  }, [watchLocation]);

  useEffect(() => {
    if (watchBio !== undefined) {
      localStorage.setItem('user_profile_bio', watchBio);
    }
  }, [watchBio]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <ProfileHeader />

          {/* Form cập nhật */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-8 space-y-8">
              <ProfileDetails
                register={register}
                control={control}
                setValue={setValue}
              />

              <StudyPreferences
                control={control}
/>


              <div className="flex justify-end gap-4">
                <Button
                  color="primary"
                  type="submit"
                  isLoading={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;
