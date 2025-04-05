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
 * Menghapus token dan data pengguna dari penyimpanan lokal dan cookie
 * @param callback - Fungsi callback opsional yang dipanggil setelah logout
 */
export const logout = (callback?: () => void) => {
  if (typeof window === 'undefined') return;
  
  // Hapus dari localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  
  // Hapus cookie dengan cara yang lebih aman
  // Metode 1: Hapus dengan set expired
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0; samesite=lax;';
  
  // Metode 2: Timpa dengan string kosong
  document.cookie = 'auth_token=; path=/;';
  
  // Jika ada callback, panggil
  if (callback) {
    callback();
  }
};

/**
 * Fungsi untuk menambahkan token ke header permintaan
 * @returns Headers dengan token otentikasi
 */
export const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
