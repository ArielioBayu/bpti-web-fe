import apiClient from '../lib/api-client';
import { PKLSubmission } from '../types';

export const pklService = {
  register: async (payload: Partial<PKLSubmission>): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/pkl/register', payload);
    return response.data;
  },

  listSubmissions: async (): Promise<PKLSubmission[]> => {
    const response = await apiClient.get<PKLSubmission[]>('/api/pkl/submissions');
    return response.data;
  },

  updateStatus: async (
    id: number,
    payload: { status: 'pending' | 'approved' | 'rejected'; notes: string }
  ): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(
      `/api/pkl/submissions/${id}/status`,
      payload
    );
    return response.data;
  },
};

export default pklService;
