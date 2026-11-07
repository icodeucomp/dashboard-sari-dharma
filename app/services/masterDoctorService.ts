import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface DoctorItem {
  id: string;
  name: string;
  photo: string;
  created_at: string;
  updated_at: string;
}

export interface ApiPaginatedResponse {
  success: boolean;
  data: {
    current_page: number;
    data: DoctorItem[];
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
  };
}

export interface ApiSingleResponse {
  success: boolean;
  data: DoctorItem;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export const getMasterDoctor = async (params: PaginationParams = {}): Promise<ApiPaginatedResponse> => {
  const response = await axios.get<ApiPaginatedResponse>(`${BASE_URL}/api/doctors`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getMasterDoctorById = async (id: string): Promise<ApiSingleResponse> => {
  const response = await axios.get<ApiSingleResponse>(`${BASE_URL}/api/doctors/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

export const createMasterDoctor = async (data: FormData): Promise<ApiSingleResponse> => {
  const response = await axios.post<ApiSingleResponse>(`${BASE_URL}/api/doctors`, data, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateMasterDoctor = async (id: string, data: FormData): Promise<ApiSingleResponse> => {
  data.append('_method', 'PUT');

  const response = await axios.post<ApiSingleResponse>(`${BASE_URL}/api/doctors/${id}`, data, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteMasterDoctor = async (id: string): Promise<ApiMessageResponse> => {
  const response = await axios.delete<ApiMessageResponse>(`${BASE_URL}/api/doctors/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

export const getDoctorList = async (): Promise<{success: boolean, data: DoctorItem[]}> => {
  const response = await axios.get<{success: boolean, data: DoctorItem[]}>(`${BASE_URL}/api/doctors/list`, {
    headers: authHeader(),
  });
  return response.data;
};
