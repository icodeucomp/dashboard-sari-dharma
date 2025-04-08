import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk kategori master
 */
export interface Kategori {
  id: string;
  name: string;
  flag: string;
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: Kategori[];
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
 * Parameter untuk pagination dan filter
 */
export interface GetKategoriParams {
  search?: string;
  flag?: string;
  page?: number;
  per_page?: number;
}

/**
 * Fungsi untuk mendapatkan daftar kategori untuk dropdown
 * @param params - Parameter untuk request
 * @returns Promise dengan respons API
 */
export const getKategoriList = async (params: GetKategoriParams = {}) => {
  const response = await axios.get<{ success: boolean; data: PaginationInfo }>(
    `${BASE_URL}/api/master-kategori`,
    { 
      params,
      headers: authHeader() 
    }
  );
  
  if (response.data.success) {
    return {
      success: true,
      data: response.data.data.data
    };
  }
  
  return {
    success: false,
    data: []
  };
};

/**
 * Fungsi untuk membuat kategori baru
 * @param name - Nama kategori
 * @param flag - Flag kategori untuk menentukan jenis kategori
 * @returns Promise dengan respons API
 */
export const createKategori = async (name: string, flag: string) => {
  const data = {
    name: name,
    flag: flag
  };
  
  const response = await axios.post<{ success: boolean; data: Kategori }>(
    `${BASE_URL}/api/master-kategori`, 
    data,
    { headers: authHeader() }
  );
  
  return response.data;
};
