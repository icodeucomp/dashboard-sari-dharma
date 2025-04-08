import axios from "axios";
import { authHeader } from "./authService";

// Konstanta untuk URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

/**
 * Interface untuk data dokter
 */
export interface DokterItem {
  id: string;
  nama_dokter: string;
  foto: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk parameter request
 */
export interface GetDokterParams {
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Interface untuk response API pagination
 */
export interface PaginationResponse<T> {
  current_page: number;
  data: T[];
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
 * Fungsi untuk mengambil data semua dokter
 * @param {GetDokterParams} params - Parameter untuk request
 * @returns {Promise<{success: boolean, data: PaginationResponse<DokterItem>}>}
 */
export const getMasterDokter = async (params: GetDokterParams = {}) => {
  try {
    const response = await axios.get(BASE_URL + "/api/master-dokter", {
      headers: authHeader(),
      params: {
        search: params.search || "",
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching dokter data:", error);
    return { success: false, data: null };
  }
};
