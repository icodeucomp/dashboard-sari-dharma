import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk item indikator mutu
 */
export interface IndikatorMutuItem {
  id: string;
  judul: string;
  file_pdf: string;
  foto: string; // Tambah field foto
  slug?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: IndikatorMutuItem[];
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
  data: IndikatorMutuItem;
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
 * Fungsi untuk mendapatkan semua indikator mutu
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getIndikatorMutu = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/indikator-mutu`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail indikator mutu berdasarkan ID
 * @param slug - Slug indikator mutu
 * @param id - ID indikator mutu (terenkripsi)
 * @returns Promise dengan respons API
 */
export const getIndikatorMutuById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/indikator-mutu/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk membuat indikator mutu baru
 * @param data - Data indikator mutu (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const createIndikatorMutu = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/indikator-mutu`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate indikator mutu
 * @param id - ID indikator mutu (terenkripsi)
 * @param data - Data indikator mutu yang diperbarui (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const updateIndikatorMutu = async (id: string, data: FormData) => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append('_method', 'PUT');
  
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/indikator-mutu/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus indikator mutu
 * @param id - ID indikator mutu (terenkripsi)
 * @returns Promise dengan respons API
 */
export const deleteIndikatorMutu = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/indikator-mutu/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
