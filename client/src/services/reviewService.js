import apiClient from './apiClient.js';

export const reviewAPI = {
  trigger: (projectId) => apiClient.post(`/reviews/${projectId}/analyze`),
  get: (projectId) => apiClient.get(`/reviews/${projectId}`),
};
