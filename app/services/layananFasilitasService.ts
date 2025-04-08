import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk item layanan fasilitas
 */
export interface LayananFasilitasItem {
  id: string;
  slug: string;
  nama_fasilitas: string;
  deskripsi_overview: string;
  layanan_fasilitas: string;
  foto_header: string;
  foto_lainnya: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: LayananFasilitasItem[];
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
 * Fungsi untuk mendapatkan semua layanan fasilitas
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getLayananFasilitas = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/layanan-fasilitas`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail layanan fasilitas berdasarkan ID
 * @param slug - Slug layanan fasilitas
 * @param id - ID layanan fasilitas (terenkripsi)
 * @returns Promise dengan respons API
 */
export const getLayananFasilitasById = async (slug: string, id: string) => {
  const response = await axios.get<{
    success: boolean;
    data: LayananFasilitasItem;
  }>(`${BASE_URL}/api/layanan-fasilitas/${slug}/${id}`, { headers: authHeader() });
  return response.data;
};

/**
 * Fungsi untuk membuat layanan fasilitas baru
 * @param data - Data layanan fasilitas (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const createLayananFasilitas = async (data: FormData) => {
  const response = await axios.post<{
    success: boolean;
    data: LayananFasilitasItem;
  }>(`${BASE_URL}/api/layanan-fasilitas`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate layanan fasilitas
 * @param id - ID layanan fasilitas (terenkripsi)
 * @param data - Data layanan fasilitas yang diperbarui (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const updateLayananFasilitas = async (id: string, data: FormData) => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append('_method', 'PUT');
  
  const response = await axios.post<{
    success: boolean;
    data: LayananFasilitasItem;
  }>(`${BASE_URL}/api/layanan-fasilitas/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus layanan fasilitas
 * @param id - ID layanan fasilitas (terenkripsi)
 * @returns Promise dengan respons API
 */
export const deleteLayananFasilitas = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/layanan-fasilitas/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
