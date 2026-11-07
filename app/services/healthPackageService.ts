import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface HealthPackageItem {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  promo: number;
  valid_until: string | null;
  description: string;
  photo: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    flag: string;
  };
}

export interface PaginationInfo {
  current_page: number;
  data: HealthPackageItem[];
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

export interface ApiResponse {
  success: boolean;
  data: PaginationInfo;
}

export interface ApiItemResponse {
  success: boolean;
  data: HealthPackageItem;
}

export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
  category_id?: string;
  promo?: number;
  valid_start?: string;
  valid_end?: string;
}

export const getHealthPackage = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/health-packages`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getHealthPackageById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/health-packages/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const createHealthPackage = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/health-packages`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateHealthPackage = async (id: string, data: FormData) => {
  data.append('_method', 'PUT');

  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/health-packages/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteHealthPackage = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/health-packages/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
