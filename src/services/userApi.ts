// src/api/userApi.ts
import { apiClient } from '@/lib/api';

export interface UserProfile {
  id: number;
  email: string;
  name: string | null;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

export class UserApiService {
  private static readonly BASE_PATH = '/auth';

  /**
   * Lấy thông tin user hiện tại
   */
  static async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(
        `${UserApiService.BASE_PATH}/profile`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw new Error('Không thể tải thông tin người dùng');
    }
  }

  /**
   * Cập nhật thông tin user
   */
  static async updateProfile(data: UpdateUserRequest): Promise<UserProfile> {
    try {
      const response = await apiClient.patch<UserProfile>(
        `${UserApiService.BASE_PATH}/profile`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Không thể cập nhật thông tin người dùng');
    }
  }
}

export default UserApiService;
