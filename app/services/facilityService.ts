import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface FacilityServiceItem {
  id: string;
  slug: string;
  name: string;
  overview_description: string;
  services: string;
  header_photo: string;
  other_photo: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  data: FacilityServiceItem[];
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

export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export const getFacilityService = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/facility-services`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getFacilityServiceById = async (slug: string, id: string) => {
  const response = await axios.get<{
    success: boolean;
    data: FacilityServiceItem;
  }>(`${BASE_URL}/api/facility-services/${slug}/${id}`, { headers: authHeader() });
  return response.data;
};

export const createFacilityService = async (data: FormData) => {
  const response = await axios.post<{
    success: boolean;
    data: FacilityServiceItem;
  }>(`${BASE_URL}/api/facility-services`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateFacilityService = async (id: string, data: FormData) => {
  data.append('_method', 'PUT');

  const response = await axios.post<{
    success: boolean;
    data: FacilityServiceItem;
  }>(`${BASE_URL}/api/facility-services/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFacilityService = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/facility-services/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
