import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface CertificationAwardItem {
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
  data: CertificationAwardItem[];
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

export const getCertificationAward = async (params: { search?: string; page?: number; per_page?: number }) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/certification-awards`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getCertificationAwardById = async (slug: string, id: string) => {
  const response = await axios.get<{ success: boolean; data: CertificationAwardItem }>(
    `${BASE_URL}/api/certification-awards/${slug}/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const createCertificationAward = async (data: FormData) => {
  const response = await axios.post<{ success: boolean; data: CertificationAwardItem }>(
    `${BASE_URL}/api/certification-awards`,
    data,
    {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateCertificationAward = async (id: string, data: FormData) => {
  data.append("_method", "PUT");

  const response = await axios.post<{ success: boolean; data: CertificationAwardItem }>(
    `${BASE_URL}/api/certification-awards/${id}`,
    data,
    {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteCertificationAward = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/certification-awards/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
