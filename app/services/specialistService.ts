import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface SpecialistServiceItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  doctors: {
    id: string;
    name: string;
    doctor_background: string;
    photo: string;
    pivot: {
      specialist_id: string;
      doctor_id: string;
    }
  }[];
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  data: SpecialistServiceItem[];
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

export const getSpecialistService = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/specialist-services`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getSpecialistServiceById = async (slug: string, id: string) => {
  const response = await axios.get<{
    success: boolean;
    data: SpecialistServiceItem;
  }>(`${BASE_URL}/api/specialist-services/${slug}/${id}`, { headers: authHeader() });
  return response.data;
};

export const createSpecialistService = async (data: {
  name: string;
  description: string;
  icon: string;
  doctor_ids: string[];
}) => {
  const response = await axios.post<{
    success: boolean;
    data: SpecialistServiceItem;
  }>(`${BASE_URL}/api/specialist-services`, data, {
    headers: authHeader(),
  });
  return response.data;
};

export const updateSpecialistService = async (
  id: string,
  data: {
    name: string;
    description: string;
    icon: string;
    doctor_ids: string[];
  }
) => {
  const response = await axios.post<{
    success: boolean;
    data: SpecialistServiceItem;
  }>(`${BASE_URL}/api/specialist-services/${id}`, data, {
    headers: {
      ...authHeader(),
    },
    params: {
      _method: "PUT",
    },
  });
  return response.data;
};

export const deleteSpecialistService = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/specialist-services/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
