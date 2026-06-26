import apiClient from './apiClient.js';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/update-profile', data),
  changePassword: (data) => apiClient.put('/auth/change-password', data),
};
