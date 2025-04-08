import axios from "axios";
import { authHeader } from "./authService";

// Konstanta untuk URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

// Interface untuk item layanan unggulan
export interface LayananUnggulanItem {
  id: string;
  slug: string;
  nama_layanan: string;
  deskripsi: string;
  foto: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk struktur pagination
export interface PaginationInfo {
  current_page: number;
  data: LayananUnggulanItem[];
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

// Interface untuk respons API dengan pagination
export interface ApiResponse {
  code: number;
  success: boolean;
  data: PaginationInfo;
}

// Parameter untuk pagination dan pencarian
export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Fungsi untuk mendapatkan semua layanan unggulan
 * @param params - Parameter untuk pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getLayananUnggulan = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(
    `${BASE_URL}/api/layanan-unggulan`,
    {
      params,
      headers: authHeader(),
    }
  );
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail layanan unggulan berdasarkan ID
 * @param id - ID layanan unggulan
 * @returns Promise dengan respons API
 */
export const getLayananUnggulanById = async (slug: string, id: string) => {
  const response = await axios.get<{
    success: boolean;
    data: LayananUnggulanItem;
  }>(`${BASE_URL}/api/layanan-unggulan/${slug}/${id}`, { headers: authHeader() });
  return response.data;
};

/**
 * Fungsi untuk membuat layanan unggulan baru
 * @param formData - Data layanan unggulan dalam bentuk FormData
 * @returns Promise dengan respons API
 */
export const createLayananUnggulan = async (formData: FormData) => {
  const response = await axios.post<{
    success: boolean;
    data: LayananUnggulanItem;
  }>(`${BASE_URL}/api/layanan-unggulan`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate layanan unggulan
 * @param id - ID layanan unggulan
 * @param formData - Data layanan unggulan dalam bentuk FormData
 * @returns Promise dengan respons API
 */
export const updateLayananUnggulan = async (id: string, formData: FormData) => {
  const response = await axios.post<{
    success: boolean;
    data: LayananUnggulanItem;
  }>(`${BASE_URL}/api/layanan-unggulan/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
    params: {
      _method: "PUT",
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus layanan unggulan
 * @param id - ID layanan unggulan
 * @returns Promise dengan respons API
 */
export const deleteLayananUnggulan = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/layanan-unggulan/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
