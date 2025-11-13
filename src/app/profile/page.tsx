'use client';

import React, { useEffect, useState } from 'react';

import Sidebar from '../../components/home/Sidebar';
import ProfileHeader from '../../components/home/ProfileHeader';
import ProfileDetails from '../../components/home/ProfileDetails';
import StudyPreferences from '../../components/home/StudyPreference';
import { type UserProfile } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProfile, updateUserProfile } from '../../store/slices/userSlice';
import type { UpdateUserRequest } from '../../services/userApi';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile: backendProfile, isLoading, error, isUpdating } = useAppSelector(
    state => state.user
  );

  // Local state for UI - maps backend data to UI format
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    location: '',
    bio: '',
    focusDuration: 25,
    breakDuration: 5,
    dailyGoal: 4,
    joinedDate: ''
  });

  // Load temporary fields from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocation = localStorage.getItem('user_profile_location');
      const savedBio = localStorage.getItem('user_profile_bio');
      if (savedLocation || savedBio) {
        setUserProfile(prev => ({
          ...prev,
          location: savedLocation || prev.location,
          bio: savedBio || prev.bio,
        }));
      }
    }
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Map backend profile to UI profile format
  useEffect(() => {
    if (backendProfile) {
      // Load temporary fields from localStorage if available
      const savedLocation = typeof window !== 'undefined' 
        ? localStorage.getItem('user_profile_location') || ''
        : '';
      const savedBio = typeof window !== 'undefined'
        ? localStorage.getItem('user_profile_bio') || ''
        : '';

      setUserProfile({
        fullName: backendProfile.name || '',
        email: backendProfile.email || '',
        location: savedLocation, // Load from localStorage (not synced with backend)
        bio: savedBio, // Load from localStorage (not synced with backend)
        focusDuration: 25, // Default value, can be extended later
        breakDuration: 5, // Default value, can be extended later
        dailyGoal: 4, // Default value, can be extended later
        joinedDate: backendProfile.createdAt 
          ? `Joined ${new Date(backendProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
          : ''
      });
    }
  }, [backendProfile]);

  // Handle save changes
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSave = async () => {
    const updateData: UpdateUserRequest = {
      name: userProfile.fullName,
      email: userProfile.email,
    };

    try {
      await dispatch(updateUserProfile(updateData)).unwrap();
      setSaveSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      // Error is already in Redux state
    }
  };

  // Update local state when user edits
  const handleProfileChange = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...updates };
      
      // Save location and bio to localStorage (temporary storage, not synced with backend)
      if (typeof window !== 'undefined') {
        if ('location' in updates) {
          localStorage.setItem('user_profile_location', updated.location || '');
        }
        if ('bio' in updates) {
          localStorage.setItem('user_profile_bio', updated.bio || '');
        }
      }
      
      return updated;
    });
  };

  if (isLoading && !backendProfile) {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">Đang tải thông tin người dùng...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <ProfileHeader />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {saveSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ Đã lưu thành công! (Chỉ tên và email được lưu vào server. Location và Bio được lưu tạm trên trình duyệt)
            </div>
          )}
          <div className="mt-8 space-y-8">
            <ProfileDetails
              userProfile={userProfile}
              setUserProfile={handleProfileChange}
            />
            <StudyPreferences
              userProfile={userProfile}
              setUserProfile={handleProfileChange}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
