import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export interface ScheduleItem {
  day: string;
  start_time: string;
  end_time: string;
}

export interface EducationCareerItem {
  title: string;
  start_year: number | string;
  end_year: number | string | null;
}

export interface Doctor {
  id: string;
  name: string;
  photo: string;
}

export interface Specialist {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DoctorScheduleItem {
  id: string;
  doctor_id: string;
  specialist_id: string;
  doctor_background: string;
  schedule: ScheduleItem[];
  education_career: EducationCareerItem[];
  photo: string;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
  specialist?: Specialist;
}

export interface PaginationInfo {
  current_page: number;
  data: DoctorScheduleItem[];
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
  data: DoctorScheduleItem;
}

export interface PaginationParams {
  search?: string;
  page?: number;
  per_page?: number;
  doctor_id?: string;
  specialist_id?: string;
}

export const getDoctorSchedule = async (params: PaginationParams = {}) => {
  const response = await axios.get<ApiResponse>(
    `${BASE_URL}/api/doctor-schedules`,
    {
      params,
      headers: authHeader(),
    }
  );
  return response.data;
};

export const getDoctorScheduleById = async (id: string) => {
  const response = await axios.get<ApiItemResponse>(
    `${BASE_URL}/api/doctor-schedules/${id}`,
    {
      headers: authHeader(),
    }
  );
  return response.data;
};

export const createDoctorSchedule = async (data: FormData) => {
  const response = await axios.post<ApiItemResponse>(
    `${BASE_URL}/api/doctor-schedules`,
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

export const updateDoctorSchedule = async (id: string, data: FormData) => {
  data.append("_method", "PUT");

  const response = await axios.post<ApiItemResponse>(
    `${BASE_URL}/api/doctor-schedules/${id}`,
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

export const deleteDoctorSchedule = async (id: string) => {
  const response = await axios.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/api/doctor-schedules/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const getDoctorList = async (searchName = "") => {
  const response = await axios.get<{
    success: boolean;
    data: Doctor[] | { data: Doctor[] };
  }>(`${BASE_URL}/api/doctors`, {
    headers: authHeader(),
    params: { search: searchName },
  });

  if (response.data.success) {
    if (
      response.data.data &&
      typeof response.data.data === "object" &&
      "data" in response.data.data
    ) {
      return {
        success: true,
        data: response.data.data.data,
      };
    }
    return response.data;
  }

  return {
    success: false,
    data: [],
  };
};

export const getSpecialistList = async () => {
  const response = await axios.get<{
    success: boolean;
    data: Specialist[] | { data: Specialist[] };
  }>(`${BASE_URL}/api/specialist-services`, { headers: authHeader() });

  if (response.data.success) {
    if (
      response.data.data &&
      typeof response.data.data === "object" &&
      "data" in response.data.data
    ) {
      return {
        success: true,
        data: response.data.data.data,
      };
    }
    return response.data;
  }

  return {
    success: false,
    data: [],
  };
};
