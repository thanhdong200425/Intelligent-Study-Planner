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
