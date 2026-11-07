import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface CommunityEventItem {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
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
  data: CommunityEventItem[];
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
  data: CommunityEventItem;
}

export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
  category_id?: string;
}

export const getCommunityEvent = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/community-events`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getCommunityEventById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/community-events/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const createCommunityEvent = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/community-events`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCommunityEvent = async (id: string, data: FormData) => {
  data.append('_method', 'PUT');

  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/community-events/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCommunityEvent = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/community-events/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
