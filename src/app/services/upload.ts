import apiClient from '../lib/api-client';

export const uploadService = {
  upload: async (file: File): Promise<{ file_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ file_url: string }>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default uploadService;
