import apiClient from '../lib/api-client';
import { Download } from '../types';

export const downloadsService = {
  list: async (params?: { category?: string }): Promise<Download[]> => {
    const response = await apiClient.get<Download[]>('/api/downloads', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Download> => {
    const response = await apiClient.get<Download>(`/api/downloads/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Download>): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/downloads', payload);
    return response.data;
  },

  update: async (id: number, payload: Partial<Download>): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(`/api/downloads/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/downloads/${id}`);
    return response.data;
  },
};

export default downloadsService;
