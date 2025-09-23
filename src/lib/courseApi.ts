import { apiClient } from './api';
import { Course } from '@/types';

export interface CreateCourseRequest {
  name: string;
  color: string;
}

export type UpdateCourseRequest = Partial<CreateCourseRequest>;

export class CourseApiService {
  private static readonly BASE_PATH = '/courses';

  /**
   * Get all courses for the authenticated user
   */
  static async getCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<Course[]>(
        CourseApiService.BASE_PATH
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  /**
   * Create a new course
   */
  static async createCourse(data: CreateCourseRequest): Promise<Course> {
    try {
      const response = await apiClient.post<Course>(
        CourseApiService.BASE_PATH,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create course:', error);
      throw new Error('Failed to create course');
    }
  }

  /**
   * Update an existing course
   */
  static async updateCourse(
    id: number,
    data: UpdateCourseRequest
  ): Promise<Course> {
    try {
      const response = await apiClient.put<Course>(
        `${CourseApiService.BASE_PATH}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update course:', error);
      throw new Error('Failed to update course');
    }
  }

  /**
   * Delete a course
   */
  static async deleteCourse(id: number): Promise<void> {
    try {
      await apiClient.delete(`${CourseApiService.BASE_PATH}/${id}`);
    } catch (error) {
      console.error('Failed to delete course:', error);
      throw new Error('Failed to delete course');
    }
  }
}

export default CourseApiService;
