import { env } from '@/utils/env';
import axios from 'axios';

const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Appel au refresh (le refresh token est dans le cookie HTTP-only)
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`, 
          {}, 
          { withCredentials: true }
        );
        
        const newToken = res.data.access_token;
        sessionStorage.setItem('access_token', newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        sessionStorage.removeItem('access_token');
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;