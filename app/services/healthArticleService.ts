import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface CategoryArticle {
  id: string;
  name: string;
  flag: string;
}

export interface DoctorArticle {
  id: string;
  name: string;
  photo: string;
  pivot?: {
    article_id: string;
    doctor_id: string;
  };
}

export interface HealthArticleItem {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  content: string;
  photo: string;
  created_at: string;
  updated_at: string;
  category?: CategoryArticle;
  related_doctors?: string[];
}

export interface PaginationInfo {
  current_page: number;
  data: HealthArticleItem[];
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
  data: HealthArticleItem;
}

export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
  category_id?: string | string[];
  related_doctors?: string | string[];
}

export const getHealthArticle = async (params: PaginationParams = {}) => {
  const queryParams = { ...params };

  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/health-articles`, {
    params: queryParams,
    headers: authHeader(),
    paramsSerializer: params => {
      const searchParams = new URLSearchParams();

      for (const key in params) {
        if (key === 'related_doctors' && Array.isArray(params[key])) {
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

export const getHealthArticleById = async (slug: string, id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/health-articles/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const createHealthArticle = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/health-articles`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateHealthArticle = async (id: string, data: FormData) => {
  data.append('_method', 'PUT');

  const response = await axios.post<ApiItemResponse>(`${BASE_URL}/api/health-articles/${id}`, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteHealthArticle = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/health-articles/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const getCategoryArticle = async (search?: string) => {
  const params = {
    flag: 'HealthArticle',
    search: search,
    per_page: 100
  };

  const response = await axios.get<{ success: boolean; data: PaginationInfo }>(
    `${BASE_URL}/api/categories`,
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
