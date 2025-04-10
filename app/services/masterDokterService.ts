import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk parameter paginasi
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
}

/**
 * Interface untuk item dokter
 */
export interface DokterItem {
  id: string;
  nama_dokter: string;
  foto: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk respons API yang berisi data pagination
 */
export interface ApiPaginatedResponse {
  success: boolean;
  data: {
    current_page: number;
    data: DokterItem[];
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
  };
}

/**
 * Interface untuk respons API yang berisi satu data dokter
 */
export interface ApiSingleResponse {
  success: boolean;
  data: DokterItem;
}

/**
 * Interface untuk respons API yang berisi pesan
 */
export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

/**
 * Fungsi untuk mendapatkan semua data master dokter dengan pagination
 * @param {PaginationParams} params - Parameter untuk pagination dan filtering
 * @returns {Promise<ApiPaginatedResponse>} - Promise yang berisi data master dokter
 */
export const getMasterDokter = async (params: PaginationParams = {}): Promise<ApiPaginatedResponse> => {
  const response = await axios.get<ApiPaginatedResponse>(`${BASE_URL}/api/master-dokter`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan data dokter berdasarkan ID
 * @param {string} id - ID dokter yang akan diambil datanya
 * @returns {Promise<ApiSingleResponse>} - Promise yang berisi data dokter
 */
export const getMasterDokterById = async (id: string): Promise<ApiSingleResponse> => {
  const response = await axios.get<ApiSingleResponse>(`${BASE_URL}/api/master-dokter/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk membuat data dokter baru
 * @param {FormData} data - Data dokter yang akan dibuat
 * @returns {Promise<ApiSingleResponse>} - Promise yang berisi data dokter yang dibuat
 */
export const createMasterDokter = async (data: FormData): Promise<ApiSingleResponse> => {
  const response = await axios.post<ApiSingleResponse>(`${BASE_URL}/api/master-dokter`, data, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate data dokter
 * @param {string} id - ID dokter yang akan diupdate
 * @param {FormData} data - Data dokter yang akan diupdate
 * @returns {Promise<ApiSingleResponse>} - Promise yang berisi data dokter yang diupdate
 */
export const updateMasterDokter = async (id: string, data: FormData): Promise<ApiSingleResponse> => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append('_method', 'PUT');
  
  const response = await axios.post<ApiSingleResponse>(`${BASE_URL}/api/master-dokter/${id}`, data, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus data dokter
 * @param {string} id - ID dokter yang akan dihapus
 * @returns {Promise<ApiMessageResponse>} - Promise yang berisi pesan sukses/gagal
 */
export const deleteMasterDokter = async (id: string): Promise<ApiMessageResponse> => {
  const response = await axios.delete<ApiMessageResponse>(`${BASE_URL}/api/master-dokter/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan semua data dokter (tanpa pagination)
 * @returns {Promise<{success: boolean, data: DokterItem[]}>} - Promise yang berisi data dokter
 */
export const getDokterList = async (): Promise<{success: boolean, data: DokterItem[]}> => {
  const response = await axios.get<{success: boolean, data: DokterItem[]}>(`${BASE_URL}/api/master-dokter/list`, {
    headers: authHeader(),
  });
  return response.data;
};
