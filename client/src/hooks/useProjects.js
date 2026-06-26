import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectAPI } from '../services/projectService.js';
import { reviewAPI } from '../services/reviewService.js';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await projectAPI.getAll();
      return res.data.data.projects;
    },
  });
};

export const useProject = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await projectAPI.getOne(id);
      return res.data.data.project;
    },
    enabled: Boolean(id),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => projectAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useTriggerReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId) => reviewAPI.trigger(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['review', projectId] });
    },
  });
};

export const useReview = (projectId) => {
  return useQuery({
    queryKey: ['review', projectId],
    queryFn: async () => {
      const res = await reviewAPI.get(projectId);
      return res.data.data.review;
    },
    enabled: Boolean(projectId),
  });
};
