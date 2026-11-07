import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface Category {
  id: string;
  name: string;
  page: string;
  flag: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  data: Category[];
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

export interface GetCategoryParams {
  search?: string;
  flag?: string;
  page?: number;
  per_page?: number;
}

export interface ApiPaginatedResponse {
  success: boolean;
  data: PaginationInfo;
}

export interface ApiSingleResponse {
  success: boolean;
  data: Category;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export const getMasterCategory = async (params: GetCategoryParams = {}): Promise<ApiPaginatedResponse> => {
  const response = await axios.get<ApiPaginatedResponse>(`${BASE_URL}/api/categories`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getMasterCategoryById = async (id: string): Promise<ApiSingleResponse> => {
  const response = await axios.get<ApiSingleResponse>(`${BASE_URL}/api/categories/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

export const createMasterCategory = async (name: string, page: string, flag: string): Promise<ApiSingleResponse> => {
  const data = {
    name,
    page,
    flag
  };

  const response = await axios.post<ApiSingleResponse>(`${BASE_URL}/api/categories`, data, {
    headers: authHeader()
  });

  return response.data;
};

export const updateMasterCategory = async (id: string, name: string, page: string, flag: string): Promise<ApiSingleResponse> => {
  const data = {
    name,
    page,
    flag,
    _method: 'PUT'
  };

  const response = await axios.post<ApiSingleResponse>(`${BASE_URL}/api/categories/${id}`, data, {
    headers: authHeader()
  });

  return response.data;
};

export const deleteMasterCategory = async (id: string): Promise<ApiMessageResponse> => {
  const response = await axios.delete<ApiMessageResponse>(`${BASE_URL}/api/categories/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

export const getCategoryList = async (params: GetCategoryParams = {}): Promise<{success: boolean, data: Category[]}> => {
  const response = await axios.get<ApiPaginatedResponse>(`${BASE_URL}/api/categories`, {
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

export const createCategory = async (name: string, flag: string) => {
  const data = {
    name: name,
    flag: flag
  };

  const response = await axios.post<{ success: boolean; data: Category }>(
    `${BASE_URL}/api/categories`,
    data,
    { headers: authHeader() }
  );

  return response.data;
};