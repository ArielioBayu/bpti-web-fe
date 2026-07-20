import apiClient from '../lib/api-client';
import { Testimonial } from '../types';

export const testimonialsService = {
  list: async (): Promise<Testimonial[]> => {
    const response = await apiClient.get<Testimonial[]>('/api/testimonials');
    return response.data;
  },

  getById: async (id: number): Promise<Testimonial> => {
    const response = await apiClient.get<Testimonial>(`/api/testimonials/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Testimonial>): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/testimonials', payload);
    return response.data;
  },

  update: async (id: number, payload: Partial<Testimonial>): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(`/api/testimonials/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/testimonials/${id}`);
    return response.data;
  },
};

export default testimonialsService;
