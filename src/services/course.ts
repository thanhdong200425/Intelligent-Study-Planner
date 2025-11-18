import apiClient from '@/lib/api';
import { Course } from '@/types';

export interface CreateCourseRequest {
  name: string;
  color: string;
}

export type UpdateCourseRequest = Partial<CreateCourseRequest>;

const endpoint = {
  courses: '/courses',
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.get<Course[]>(endpoint.courses);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch courses');
  }
};

export const createCourse = async (
  data: CreateCourseRequest
): Promise<Course> => {
  try {
    const response = await apiClient.post<Course>(endpoint.courses, data);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response?.data?.message || 'Failed to create course');
  }
};

export const updateCourse = async (
  id: number,
  data: UpdateCourseRequest
): Promise<Course> => {
  try {
    const response = await apiClient.put<Course>(
      `${endpoint.courses}/${id}`,
      data
    );
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response?.data?.message || 'Failed to update course');
  }
};

export const deleteCourse = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${endpoint.courses}/${id}`);
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response?.data?.message || 'Failed to delete course');
  }
};
