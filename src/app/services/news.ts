import apiClient from '../lib/api-client';
import { News, NewsListResponse } from '../types';

export const newsService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<NewsListResponse> => {
    const response = await apiClient.get<NewsListResponse>('/api/news', { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<News> => {
    const response = await apiClient.get<News>(`/api/news/slug/${slug}`);
    return response.data;
  },

  getById: async (id: number): Promise<News> => {
    const response = await apiClient.get<News>(`/api/news/${id}`);
    return response.data;
  },

  create: async (payload: Partial<News>): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/news', payload);
    return response.data;
  },

  update: async (id: number, payload: Partial<News>): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(`/api/news/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/news/${id}`);
    return response.data;
  },
};

export default newsService;
