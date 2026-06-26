import apiClient from './apiClient.js';

export const portfolioAPI = {
  get: () => apiClient.get('/portfolio'),
  updateFeatured: (featuredProjects) =>
    apiClient.put('/portfolio/featured', { featuredProjects }),
  getPublic: (slug) => apiClient.get(`/portfolio/public/${slug}`),
};
