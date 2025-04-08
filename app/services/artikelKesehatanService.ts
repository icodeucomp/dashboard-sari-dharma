import axios from "axios";
import { authHeader } from "./authService";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

/**
 * Interface untuk kategori artikel kesehatan
 */
export interface KategoriArtikel {
  id: string;
  name: string;
  flag: string;
}

/**
 * Interface untuk dokter terkait artikel
 */
export interface DokterArtikel {
  id: string;
  nama_dokter: string;
  foto: string;
  pivot?: {
    artikel_id: string;
    dokter_id: string;
  };
}

/**
 * Interface untuk item artikel kesehatan
 */
export interface ArtikelKesehatanItem {
  id: string;
  judul: string;
  slug: string;
  kategori_id: string;
  konten: string;
  foto: string;
  created_at: string;
  updated_at: string;
  kategori?: KategoriArtikel;
  dokter_terkait?: string[];
}

/**
 * Interface untuk struktur pagination
 */
export interface PaginationInfo {
  current_page: number;
  data: ArtikelKesehatanItem[];
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
  data: ArtikelKesehatanItem;
}

/**
 * Parameter untuk pagination dan filter
 */
export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
  kategori_id?: string | string[];
  dokter_terkait?: string | string[];
}

/**
 * Fungsi untuk mendapatkan semua artikel kesehatan
 * @param params - Parameter pagination dan pencarian
 * @returns Promise dengan respons API
 */
export const getArtikelKesehatan = async (params: PaginationParams = {}) => {
  // Jika dokter_terkait adalah array tidak kosong, persiapkan serialisasi
  const queryParams = { ...params };
  
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/artikel-kesehatan`, {
    params: queryParams,
    headers: authHeader(),
    paramsSerializer: params => {
      // Custom serializer untuk array
      const searchParams = new URLSearchParams();
      
      for (const key in params) {
        if (key === 'dokter_terkait' && Array.isArray(params[key])) {
          // Untuk setiap id dalam array, tambahkan sebagai parameter terpisah
          params[key].forEach((id: string) => {
            searchParams.append(`${key}[]`, id);
          });
        } else if (params[key] !== undefined) {
          searchParams.append(key, params[key]);
        }
      }
      
      return searchParams.toString();
    }
  });
  
  return response.data;
};

/**
 * Fungsi untuk mendapatkan detail artikel kesehatan berdasarkan ID
 * @param slug - Slug artikel kesehatan
 * @param id - ID artikel kesehatan (terenkripsi)
 * @returns Promise dengan respons API
 */
export const getArtikelKesehatanById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/artikel-kesehatan/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk membuat artikel kesehatan baru
 * @param data - Data artikel kesehatan (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const createArtikelKesehatan = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/artikel-kesehatan`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk mengupdate artikel kesehatan
 * @param id - ID artikel kesehatan (terenkripsi)
 * @param data - Data artikel kesehatan yang diperbarui (FormData untuk upload file)
 * @returns Promise dengan respons API
 */
export const updateArtikelKesehatan = async (id: string, data: FormData) => {
  // Tambahkan parameter _method=PUT untuk simulasi method PUT dengan POST
  data.append('_method', 'PUT');
  
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/artikel-kesehatan/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fungsi untuk menghapus artikel kesehatan
 * @param id - ID artikel kesehatan (terenkripsi)
 * @returns Promise dengan respons API
 */
export const deleteArtikelKesehatan = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/artikel-kesehatan/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

/**
 * Fungsi untuk mendapatkan daftar kategori artikel
 * @param search - Kata kunci pencarian opsional
 * @returns Promise dengan respons API
 */
export const getKategoriArtikel = async (search?: string) => {
  const params = {
    flag: 'ArtikelKesehatan',
    search: search,
    per_page: 100 // Ambil lebih banyak untuk pencarian
  };
  
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
