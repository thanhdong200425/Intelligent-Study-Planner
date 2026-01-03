import apiClient from '@/lib/api';

export interface CreateFeedbackRequest {
  feedbackType: string;
  category?: string;
  subject: string;
  message: string;
  attachments?: File[];
}

export interface FeedbackResponse {
  id: number;
  feedbackType: string;
  category?: string;
  subject: string;
  message: string;
  createdAt: string;
}

const endpoint = {
  feedback: '/feedback',
};

export const createFeedback = async (
  data: CreateFeedbackRequest
): Promise<FeedbackResponse> => {
  try {
    const formData = new FormData();
    formData.append('feedbackType', data.feedbackType);
    if (data.category) {
      formData.append('category', data.category);
    }
    formData.append('subject', data.subject);
    formData.append('message', data.message);

    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    const response = await apiClient.post<FeedbackResponse>(
      endpoint.feedback,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response?.data?.message || 'Failed to submit feedback');
  }
};
