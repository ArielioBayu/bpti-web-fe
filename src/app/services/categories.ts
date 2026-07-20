import apiClient from '../lib/api-client';
import { Category } from '../types';

export const categoriesService = {
  list: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/categories');
    return response.data;
  },

  create: async (payload: Partial<Category>): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/categories', payload);
    return response.data;
  },

  update: async (id: number, payload: Partial<Category>): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(`/api/categories/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/categories/${id}`);
    return response.data;
  },
};

export default categoriesService;
