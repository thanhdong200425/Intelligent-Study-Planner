import apiClient from '@/lib/api';
import { EventType } from '@/types';

export interface CreateEventTypeRequest {
  name: string;
  color?: string;
}

export type UpdateEventTypeRequest = Partial<CreateEventTypeRequest>;

const endpoint = {
  eventTypes: '/event-types',
};

export const getEventTypes = async (): Promise<EventType[]> => {
  try {
    const response = await apiClient.get<EventType[]>(endpoint.eventTypes);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch event types'
    );
  }
};

export const getEventTypeById = async (id: number): Promise<EventType> => {
  try {
    const response = await apiClient.get<EventType>(
      `${endpoint.eventTypes}/${id}`
    );
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to fetch event type'
    );
  }
};

export const createEventType = async (
  data: CreateEventTypeRequest
): Promise<EventType> => {
  try {
    const response = await apiClient.post<EventType>(endpoint.eventTypes, data);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to create event type'
    );
  }
};

export const updateEventType = async (
  id: number,
  data: UpdateEventTypeRequest
): Promise<EventType> => {
  try {
    const response = await apiClient.put<EventType>(
      `${endpoint.eventTypes}/${id}`,
      data
    );
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to update event type'
    );
  }
};

export const deleteEventType = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${endpoint.eventTypes}/${id}`);
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(
      err.response?.data?.message || 'Failed to delete event type'
    );
  }
};
