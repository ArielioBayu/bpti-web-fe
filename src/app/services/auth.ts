import apiClient from '../lib/api-client';
import { AuthResponse, User } from '../types';

export const authService = {
  login: async (payload: Record<string, string>): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/profile');
    return response.data;
  },

  changePassword: async (payload: { old_password: string; new_password: string }): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>('/api/auth/change-password', payload);
    return response.data;
  },
};

export default authService;
