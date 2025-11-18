import apiClient from '@/lib/api';
import type { UserProfile } from '@/types';

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  location?: string;
  bio?: string;
  focusDuration?: number;
  breakDuration?: number;
  dailyGoal?: number;
}

interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

const endpoint = {
  profile: '/user',
};

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.get<ProfileResponse>(endpoint.profile);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch user profile'
    );
  }
};

export const updateProfile = async (
  data: UpdateUserRequest
): Promise<UserProfile> => {
  try {
    const response = await apiClient.patch<UserProfile>(endpoint.profile, data);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to update user profile'
    );
  }
};
