import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

export interface FeaturedServiceItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  photo: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  data: FeaturedServiceItem[];
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
  code: number;
  success: boolean;
  data: PaginationInfo;
}

export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export const getFeaturedService = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(
    `${BASE_URL}/api/featured-services`,
    {
      params,
      headers: authHeader(),
    }
  );
  return response.data;
};

export const getFeaturedServiceById = async (slug: string, id: string) => {
  const response = await axios.get<{
    success: boolean;
    data: FeaturedServiceItem;
  }>(`${BASE_URL}/api/featured-services/${slug}/${id}`, { headers: authHeader() });
  return response.data;
};

export const createFeaturedService = async (formData: FormData) => {
  const response = await axios.post<{
    success: boolean;
    data: FeaturedServiceItem;
  }>(`${BASE_URL}/api/featured-services`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
  });
  return response.data;
};

export const updateFeaturedService = async (id: string, formData: FormData) => {
  const response = await axios.post<{
    success: boolean;
    data: FeaturedServiceItem;
  }>(`${BASE_URL}/api/featured-services/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
    params: {
      _method: "PUT",
    },
  });
  return response.data;
};

export const deleteFeaturedService = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/featured-services/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
