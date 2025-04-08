import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk item sertifikasi & penghargaan
 */
export interface SertifikasiPenghargaanItem {
  id: string;
  judul: string;
  file_pdf: string;
  foto: string; // Menambahkan field foto
  slug?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: SertifikasiPenghargaanItem[];
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
 * Fungsi untuk mendapatkan semua sertifikasi & penghargaan
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getSertifikasiPenghargaan = async (params: { search?: string; page?: number; per_page?: number }) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/sertifikasi-penghargaan`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail sertifikasi & penghargaan berdasarkan ID
 * @param slug - Slug sertifikasi
 * @param id - ID sertifikasi
 * @returns Promise dengan respons API
 */
export const getSertifikasiPenghargaanById = async (slug: string, id: string) => {
  const response = await axios.get<{ success: boolean; data: SertifikasiPenghargaanItem }>(
    `${BASE_URL}/api/sertifikasi-penghargaan/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk membuat sertifikasi & penghargaan baru
 * @param data - Data sertifikasi (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const createSertifikasiPenghargaan = async (data: FormData) => {
  const response = await axios.post<{ success: boolean; data: SertifikasiPenghargaanItem }>(
    `${BASE_URL}/api/sertifikasi-penghargaan`,
    data,
    {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Fungsi untuk mengupdate sertifikasi & penghargaan
 * @param id - ID sertifikasi
 * @param data - Data sertifikasi yang diperbarui (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const updateSertifikasiPenghargaan = async (id: string, data: FormData) => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append("_method", "PUT");

  const response = await axios.post<{ success: boolean; data: SertifikasiPenghargaanItem }>(
    `${BASE_URL}/api/sertifikasi-penghargaan/${id}`,
    data,
    {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Fungsi untuk menghapus sertifikasi & penghargaan
 * @param id - ID sertifikasi
 * @returns Promise dengan respons API
 */
export const deleteSertifikasiPenghargaan = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/sertifikasi-penghargaan/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
