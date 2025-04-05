import axios from 'axios';

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

// Interface untuk data pengguna
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk respons login (disesuaikan dengan format respons API yang sebenarnya)
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Fungsi untuk melakukan login
 * @param email - Email pengguna
 * @param password - Password pengguna
 * @returns Promise dengan respons login
 */
export const login = async (email: string, password: string) => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/api/login`, {
    email,
    password
  });
  return response.data;
};

/**
 * Fungsi untuk memeriksa apakah pengguna sudah login
 * @returns Boolean yang menunjukkan status login
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('auth_token') !== null;
};

/**
 * Fungsi untuk mendapatkan token dari penyimpanan lokal
 * @returns Token otentikasi atau null jika tidak ada
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * Fungsi untuk mendapatkan data pengguna dari penyimpanan lokal
 * @returns Data pengguna atau null jika tidak ada
 */
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Fungsi untuk logout
 * Menghapus token dan data pengguna dari penyimpanan lokal
 */
export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

/**
 * Fungsi untuk menambahkan token ke header permintaan
 * @returns Headers dengan token otentikasi
 */
export const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
