import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk item paket kesehatan
 */
export interface PaketKesehatanItem {
  id: string;
  nama_paket: string;
  slug: string;
  kategori_id: string;
  promo: number;
  berlaku_sampai: string | null;
  deskripsi: string;
  foto: string;
  created_at: string;
  updated_at: string;
  kategori?: {
    id: string;
    name: string;
    flag: string;
  };
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: PaketKesehatanItem[];
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
  data: PaketKesehatanItem;
}

/**
 * Parameter untuk pagination dan filter
 */
export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
  kategori_id?: string;
  promo?: number;
  berlaku_start?: string;
  berlaku_end?: string;
}

/**
 * Fungsi untuk mendapatkan semua paket kesehatan
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getPaketKesehatan = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/paket-kesehatan`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail paket kesehatan berdasarkan ID
 * @param slug - Slug paket kesehatan
 * @param id - ID paket kesehatan (terenkripsi)
 * @returns Promise dengan respons API
 */
export const getPaketKesehatanById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/paket-kesehatan/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk membuat paket kesehatan baru
 * @param data - Data paket kesehatan (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const createPaketKesehatan = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/paket-kesehatan`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate paket kesehatan
 * @param id - ID paket kesehatan (terenkripsi)
 * @param data - Data paket kesehatan yang diperbarui (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const updatePaketKesehatan = async (id: string, data: FormData) => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append('_method', 'PUT');
  
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/paket-kesehatan/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus paket kesehatan
 * @param id - ID paket kesehatan (terenkripsi)
 * @returns Promise dengan respons API
 */
export const deletePaketKesehatan = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/paket-kesehatan/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
