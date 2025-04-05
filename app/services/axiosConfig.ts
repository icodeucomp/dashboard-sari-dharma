import axios from 'axios';
import { getToken } from './authService';

// Konstanta untuk URL dasar API dari variabel lingkungan
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

// Buat instance axios dengan konfigurasi default
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

/**
 * Interceptor untuk menambahkan token otentikasi ke header secara otomatis
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Pastikan kita berada di browser (bukan server)
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

/**
 * Interceptor untuk menangani respons error, termasuk 401 Unauthorized
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika error 401 (Unauthorized), bisa redirect ke halaman login
    if (error.response && error.response.status === 401 && typeof window !== 'undefined') {
      // Hapus token yang tidak valid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Redirect ke halaman login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
