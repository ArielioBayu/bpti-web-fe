import apiClient from '../lib/api-client';
import { TeamMember } from '../types';

export const teamService = {
  list: async (): Promise<TeamMember[]> => {
    const response = await apiClient.get<TeamMember[]>('/api/team');
    return response.data;
  },

  getById: async (id: number): Promise<TeamMember> => {
    const response = await apiClient.get<TeamMember>(`/api/team/${id}`);
    return response.data;
  },

  create: async (payload: Partial<TeamMember>): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/team', payload);
    return response.data;
  },

  update: async (id: number, payload: Partial<TeamMember>): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(`/api/team/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/team/${id}`);
    return response.data;
  },
};

export default teamService;
