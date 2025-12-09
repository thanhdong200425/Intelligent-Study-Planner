import apiClient from '@/lib/api';
import { Event } from '@/types';

export interface CreateEventRequest {
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  eventTypeId?: number;
  taskId?: number | null;
  note?: string;
}

const endpoint = {
  events: '/events',
};

export const createEvent = async (data: CreateEventRequest): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>(endpoint.events, data);
    return response.data;
  } catch (err: any) {
    console.log('Error creating event: ', err);
    throw new Error(err.response?.data?.message || 'Failed to create event');
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await apiClient.get<Event[]>(endpoint.events);
    return response.data;
  } catch (err: any) {
    console.log('Error fetching events: ', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch events');
  }
};

export const updateEvent = async (
  id: number,
  data: Partial<CreateEventRequest>
): Promise<Event> => {
  try {
    const response = await apiClient.patch<Event>(
      `${endpoint.events}/${id}`,
      data
    );
    return response.data;
  } catch (err: any) {
    console.log('Error updating event: ', err);
    throw new Error(err.response?.data?.message || 'Failed to update event');
  }
};

export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${endpoint.events}/${id}`);
  } catch (err: any) {
    console.log('Error deleting event: ', err);
    throw new Error(err.response?.data?.message || 'Failed to delete event');
  }
};
