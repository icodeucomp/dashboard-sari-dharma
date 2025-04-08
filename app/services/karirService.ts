import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk item karir
 */
export interface KarirItem {
  id: string;
  divisi: string;
  posisi: string;
  link_pendaftaran: string;
  foto: string;
  slug?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: KarirItem[];
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
 * Interface untuk respons API untuk satu item
 */
export interface ApiItemResponse {
  success: boolean;
  data: KarirItem;
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
 * Fungsi untuk mendapatkan semua karir
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getKarir = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/karir`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail karir berdasarkan ID
 * @param slug - Slug karir
 * @param id - ID karir (terenkripsi)
 * @returns Promise dengan respons API
 */
export const getKarirById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/karir/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk membuat karir baru
 * @param data - Data karir (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const createKarir = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/karir`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate karir
 * @param id - ID karir (terenkripsi)
 * @param data - Data karir yang diperbarui (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const updateKarir = async (id: string, data: FormData) => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append('_method', 'PUT');
  
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/karir/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus karir
 * @param id - ID karir (terenkripsi)
 * @returns Promise dengan respons API
 */
export const deleteKarir = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/karir/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
