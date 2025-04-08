import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk item Event & Community
 */
export interface EventCommunityItem {
  id: string;
  kategori_id: string;
  judul: string;
  slug: string;
  konten: string;
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
  data: EventCommunityItem[];
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
  data: EventCommunityItem;
}

/**
 * Parameter untuk pagination dan filter
 */
export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
  kategori_id?: string;
}

/**
 * Fungsi untuk mendapatkan semua Event & Community
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getEventCommunity = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/event-community`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail Event & Community berdasarkan ID
 * @param slug - Slug event community
 * @param id - ID event community (terenkripsi)
 * @returns Promise dengan respons API
 */
export const getEventCommunityById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/event-community/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk membuat Event & Community baru
 * @param data - Data event community (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const createEventCommunity = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/event-community`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate Event & Community
 * @param id - ID event community (terenkripsi)
 * @param data - Data event community yang diperbarui (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const updateEventCommunity = async (id: string, data: FormData) => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append('_method', 'PUT');
  
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/event-community/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus Event & Community
 * @param id - ID event community (terenkripsi)
 * @returns Promise dengan respons API
 */
export const deleteEventCommunity = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/event-community/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
