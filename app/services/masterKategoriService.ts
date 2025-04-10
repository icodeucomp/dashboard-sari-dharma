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
  page: string;
  flag: string;
  created_at: string;
  updated_at: string;
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
 * Interface untuk respons API yang berisi data pagination
 */
export interface ApiPaginatedResponse {
  success: boolean;
  data: PaginationInfo;
}

/**
 * Interface untuk respons API yang berisi satu data kategori
 */
export interface ApiSingleResponse {
  success: boolean;
  data: Kategori;
}

/**
 * Interface untuk respons API yang berisi pesan
 */
export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

/**
 * Fungsi untuk mendapatkan semua data master kategori dengan pagination
 * @param {GetKategoriParams} params - Parameter untuk pagination dan filtering
 * @returns {Promise<ApiPaginatedResponse>} - Promise yang berisi data master kategori
 */
export const getMasterKategori = async (params: GetKategoriParams = {}): Promise<ApiPaginatedResponse> => {
  const response = await axios.get<ApiPaginatedResponse>(`${BASE_URL}/api/master-kategori`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan data kategori berdasarkan ID
 * @param {string} id - ID kategori yang akan diambil datanya
 * @returns {Promise<ApiSingleResponse>} - Promise yang berisi data kategori
 */
export const getMasterKategoriById = async (id: string): Promise<ApiSingleResponse> => {
  const response = await axios.get<ApiSingleResponse>(`${BASE_URL}/api/master-kategori/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk membuat data kategori baru
 * @param {string} name - Nama kategori
 * @param {string} page - Halaman terkait
 * @param {string} flag - Flag kategori untuk menentukan jenis kategori
 * @returns {Promise<ApiSingleResponse>} - Promise yang berisi data kategori yang dibuat
 */
export const createMasterKategori = async (name: string, page: string, flag: string): Promise<ApiSingleResponse> => {
  const data = {
    name,
    page,
    flag
  };
  
  const response = await axios.post<ApiSingleResponse>(`${BASE_URL}/api/master-kategori`, data, {
    headers: authHeader()
  });
  
  return response.data;
};

/**
 * Fungsi untuk mengupdate data kategori
 * @param {string} id - ID kategori yang akan diupdate
 * @param {string} name - Nama kategori
 * @param {string} page - Halaman terkait
 * @param {string} flag - Flag kategori
 * @returns {Promise<ApiSingleResponse>} - Promise yang berisi data kategori yang diupdate
 */
export const updateMasterKategori = async (id: string, name: string, page: string, flag: string): Promise<ApiSingleResponse> => {
  const data = {
    name,
    page,
    flag,
    _method: 'PUT'
  };
  
  const response = await axios.post<ApiSingleResponse>(`${BASE_URL}/api/master-kategori/${id}`, data, {
    headers: authHeader()
  });
  
  return response.data;
};

/**
 * Fungsi untuk menghapus data kategori
 * @param {string} id - ID kategori yang akan dihapus
 * @returns {Promise<ApiMessageResponse>} - Promise yang berisi pesan sukses/gagal
 */
export const deleteMasterKategori = async (id: string): Promise<ApiMessageResponse> => {
  const response = await axios.delete<ApiMessageResponse>(`${BASE_URL}/api/master-kategori/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

/**
 * Fungsi untuk mendapatkan daftar kategori untuk dropdown
 * @param {GetKategoriParams} params - Parameter untuk request
 * @returns {Promise<{success: boolean, data: Kategori[]}>} - Promise yang berisi data kategori
 */
export const getKategoriList = async (params: GetKategoriParams = {}): Promise<{success: boolean, data: Kategori[]}> => {
  const response = await axios.get<ApiPaginatedResponse>(`${BASE_URL}/api/master-kategori`, { 
    params: { ...params, per_page: 100 },
    headers: authHeader() 
  });
  
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