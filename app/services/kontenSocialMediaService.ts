import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk data Konten Social Media
 */
export interface KontenSocialMediaItem {
  id: string;
  type: "youtube" | "instagram";
  links: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk respons API dengan pagination
 */
export interface ApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: KontenSocialMediaItem[];
    total: number;
  };
}

/**
 * Parameter untuk pagination dan filter
 */
export interface PaginationParams {
  search?: string;
  type?: string;
  page?: number;
  per_page?: number;
}

/**
 * Fungsi untuk mendapatkan semua konten social media
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getKontenSocialMedia = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/konten-social-media`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk memperbarui konten social media
 * @param id - ID konten social media
 * @param data - Data konten social media yang diperbarui
 * @returns Promise dengan respons API
 */
export const updateKontenSocialMedia = async (id: string, data: { type: string; links: string[] }) => {
  const response = await axios.post(
    `${BASE_URL}/api/konten-social-media/${id}`,
    { ...data, _method: "PUT" },
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk membuat konten social media baru
 * @param data - Data konten social media
 * @returns Promise dengan respons API
 */
export const createKontenSocialMedia = async (data: { type: string; links: string[] }) => {
  const response = await axios.post<{ success: boolean; data: KontenSocialMediaItem }>(
    `${BASE_URL}/api/konten-social-media`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};
