import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface SocialMediaContentItem {
  id: string;
  type: "youtube" | "instagram";
  links: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: SocialMediaContentItem[];
    total: number;
  };
}

export interface PaginationParams {
  search?: string;
  type?: string;
  page?: number;
  per_page?: number;
}

export const getSocialMediaContent = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/api/social-media-contents`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const updateSocialMediaContent = async (id: string, data: { type: string; links: string[] }) => {
  const response = await axios.post(
    `${BASE_URL}/api/social-media-contents/${id}`,
    { ...data, _method: "PUT" },
    { headers: authHeader() }
  );
  return response.data;
};

export const createSocialMediaContent = async (data: { type: string; links: string[] }) => {
  const response = await axios.post<{ success: boolean; data: SocialMediaContentItem }>(
    `${BASE_URL}/api/social-media-contents`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};
