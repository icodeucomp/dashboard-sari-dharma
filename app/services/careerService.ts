import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface CareerItem {
  id: string;
  division: string;
  position: string;
  application_link: string;
  photo: string;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  data: CareerItem[];
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
  data: CareerItem;
}

export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export const getCareer = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/careers`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getCareerById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/careers/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const createCareer = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/careers`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCareer = async (id: string, data: FormData) => {
  data.append('_method', 'PUT');

  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/careers/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCareer = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/careers/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
