import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk item layanan spesialis
 */
export interface LayananSpesialisItem {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  icon: string;
  dokter: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: LayananSpesialisItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

/**
 * Interface untuk respons API dengan pagination
 */
export interface ApiResponse {
  success: boolean;
  data: PaginationInfo;
}

/**
 * Parameter untuk pagination dan filter
 */
export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Fungsi untuk mendapatkan semua layanan spesialis
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getLayananSpesialis = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/layanan-spesialis`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail layanan spesialis berdasarkan ID
 * @param id - ID layanan spesialis
 * @returns Promise dengan respons API
 */
export const getLayananSpesialisById = async (id: number) => {
  const response = await axios.get<{
    success: boolean;
    data: LayananSpesialisItem;
  }>(`${BASE_URL}/api/layanan-spesialis/${id}`, { headers: authHeader() });
  return response.data;
};

/**
 * Fungsi untuk membuat layanan spesialis baru
 * @param data - Data layanan spesialis
 * @returns Promise dengan respons API
 */
export const createLayananSpesialis = async (data: {
  nama_layanan: string;
  deskripsi: string;
  icon: string;
  dokter: string[];
}) => {
  const response = await axios.post<{
    success: boolean;
    data: LayananSpesialisItem;
  }>(`${BASE_URL}/api/layanan-spesialis`, data, {
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate layanan spesialis
 * @param id - ID layanan spesialis
 * @param data - Data layanan spesialis yang diperbarui
 * @returns Promise dengan respons API
 */
export const updateLayananSpesialis = async (
  id: number,
  data: {
    nama_layanan: string;
    deskripsi: string;
    icon: string;
    dokter: string[];
  }
) => {
  const response = await axios.post<{
    success: boolean;
    data: LayananSpesialisItem;
  }>(`${BASE_URL}/api/layanan-spesialis/${id}`, data, {
    headers: {
      ...authHeader(),
    },
    params: {
      _method: "PUT", // Menggunakan method POST dengan parameter _method=PUT
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus layanan spesialis
 * @param id - ID layanan spesialis
 * @returns Promise dengan respons API
 */
export const deleteLayananSpesialis = async (id: number) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/layanan-spesialis/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
