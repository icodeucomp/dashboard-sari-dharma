import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk objek jadwal
 */
export interface JadwalItem {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

/**
 * Interface untuk objek edukasi/karir
 */
export interface EdukasiKarirItem {
  judul: string;
  tahun_mulai: number | string;
  tahun_selesai: number | string | null;
}

/**
 * Interface untuk objek dokter
 */
export interface Dokter {
  id: string;
  nama_dokter: string;
  foto: string;
}

/**
 * Interface untuk objek spesialis
 */
export interface Spesialis {
  id: string;
  nama_layanan: string;
  deskripsi: string;
  icon: string;
}

/**
 * Interface untuk item jadwal dokter
 */
export interface JadwalDokterItem {
  id: string;
  dokter_id: string;
  spesialis_id: string;
  background_dokter: string;
  jadwal_dokter: JadwalItem[];
  edukasi_karir: EdukasiKarirItem[];
  foto: string;
  created_at: string;
  updated_at: string;
  dokter?: Dokter;
  spesialis?: Spesialis;
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: JadwalDokterItem[];
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
  data: JadwalDokterItem;
}

/**
 * Parameter untuk pagination dan filter
 */
export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
  dokter_id?: string;
  spesialis_id?: string;
}

/**
 * Fungsi untuk mendapatkan semua jadwal dokter
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getJadwalDokter = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/jadwal-dokter`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail jadwal dokter berdasarkan ID
 * @param id - ID jadwal dokter (terenkripsi)
 * @returns Promise dengan respons API
 */
export const getJadwalDokterById = async (id: string) => {
  const response = await axios.get<ApiItemResponse>(`${BASE_URL}/api/jadwal-dokter/${id}`, { 
    headers: authHeader() 
  });
  return response.data;
};

/**
 * Fungsi untuk membuat jadwal dokter baru
 * @param data - Data jadwal dokter (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const createJadwalDokter = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/jadwal-dokter`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate jadwal dokter
 * @param id - ID jadwal dokter (terenkripsi)
 * @param data - Data jadwal dokter yang diperbarui (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const updateJadwalDokter = async (id: string, data: FormData) => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append('_method', 'PUT');
  
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/jadwal-dokter/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus jadwal dokter
 * @param id - ID jadwal dokter (terenkripsi)
 * @returns Promise dengan respons API
 */
export const deleteJadwalDokter = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/jadwal-dokter/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk mendapatkan daftar dokter (untuk dropdown)
 * @returns Promise dengan respons API
 */
export const getDokterList = async () => {
  const response = await axios.get<{ success: boolean; data: Dokter[] | { data: Dokter[] } }>(
    `${BASE_URL}/api/master-dokter`,
    { headers: authHeader() }
  );
  
  // Cek struktur data respons - beberapa API mengembalikan { data: { data: [] } }
  if (response.data.success) {
    // Jika data adalah objek dengan properti data, ambil array dari sana
    if (response.data.data && typeof response.data.data === 'object' && 'data' in response.data.data) {
      return {
        success: true,
        data: response.data.data.data
      };
    }
    // Jika data langsung berupa array
    return response.data;
  }
  
  return {
    success: false,
    data: []
  };
};

/**
 * Fungsi untuk mendapatkan daftar spesialis (untuk dropdown)
 * @returns Promise dengan respons API
 */
export const getSpesialisList = async () => {
  const response = await axios.get<{ success: boolean; data: Spesialis[] | { data: Spesialis[] } }>(
    `${BASE_URL}/api/layanan-spesialis`,
    { headers: authHeader() }
  );
  
  // Cek struktur data respons - beberapa API mengembalikan { data: { data: [] } }
  if (response.data.success) {
    // Jika data adalah objek dengan properti data, ambil array dari sana
    if (response.data.data && typeof response.data.data === 'object' && 'data' in response.data.data) {
      return {
        success: true,
        data: response.data.data.data
      };
    }
    // Jika data langsung berupa array
    return response.data;
  }
  
  return {
    success: false,
    data: []
  };
};
