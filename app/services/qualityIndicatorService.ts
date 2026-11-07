import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface QualityIndicatorItem {
  id: string;
  title: string;
  pdf_file: string;
  photo: string;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  data: QualityIndicatorItem[];
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
  data: QualityIndicatorItem;
}

export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export const getQualityIndicator = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/quality-indicators`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getQualityIndicatorById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/quality-indicators/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const createQualityIndicator = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/quality-indicators`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateQualityIndicator = async (id: string, data: FormData) => {
  data.append('_method', 'PUT');

  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/quality-indicators/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteQualityIndicator = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/quality-indicators/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
