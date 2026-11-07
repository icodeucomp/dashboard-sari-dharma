import axios from 'axios';
import { getToken } from './authService';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace(new URL('/login', window.location.origin).href);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
