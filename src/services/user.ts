// src/api/userApi.ts
import { apiClient } from '@/lib/api';
import type { UserProfile } from '@/types';

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  location?: string;
  bio?: string;
  focusDuration?: number;
  breakDuration?: number;
  dailyGoal?: number;
}

export class UserApiService {
  private static readonly BASE_PATH = '/auth';

  /**
   * Fetch current user profile
   */
  static async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(
        `${UserApiService.BASE_PATH}/profile`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw new Error('Unable to load user profile');
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateUserRequest): Promise<UserProfile> {
    try {
      const response = await apiClient.patch<UserProfile>(
        `${UserApiService.BASE_PATH}/profile`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error('Unable to update user profile');
    }
  }
}

export default UserApiService;
