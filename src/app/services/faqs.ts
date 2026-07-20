import apiClient from '../lib/api-client';
import { FAQ } from '../types';

export const faqsService = {
  list: async (): Promise<FAQ[]> => {
    const response = await apiClient.get<FAQ[]>('/api/faqs');
    return response.data;
  },

  getById: async (id: number): Promise<FAQ> => {
    const response = await apiClient.get<FAQ>(`/api/faqs/${id}`);
    return response.data;
  },

  create: async (payload: Partial<FAQ>): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/faqs', payload);
    return response.data;
  },

  update: async (id: number, payload: Partial<FAQ>): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(`/api/faqs/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/faqs/${id}`);
    return response.data;
  },
};

export default faqsService;
