import apiClient from '../lib/api-client';
import { Product } from '../types';

export const productsService = {
  list: async (params?: { category?: string }): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/api/products', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Product>): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/products', payload);
    return response.data;
  },

  update: async (id: number, payload: Partial<Product>): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(`/api/products/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/products/${id}`);
    return response.data;
  },
};

export default productsService;
