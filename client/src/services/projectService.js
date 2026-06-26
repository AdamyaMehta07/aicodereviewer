import apiClient from './apiClient.js';

export const projectAPI = {
  create: (data) => apiClient.post('/projects', data),
  getAll: () => apiClient.get('/projects'),
  getOne: (id) => apiClient.get(`/projects/${id}`),
  delete: (id) => apiClient.delete(`/projects/${id}`),
};
