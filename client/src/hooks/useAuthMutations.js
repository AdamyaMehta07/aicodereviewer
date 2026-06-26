import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authAPI.login(data),
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      login(user, token);
      navigate('/dashboard', { replace: true });
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authAPI.register(data),
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      login(user, token);
      navigate('/dashboard', { replace: true });
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data) => authAPI.updateProfile(data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => authAPI.changePassword(data),
  });
};
