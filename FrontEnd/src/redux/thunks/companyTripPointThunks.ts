import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import type { 
  TripPointListResponse, 
  TripPointResponse,
  CreateTripPointRequest,
  UpdateTripPointRequest
} from '@/types/companyTripPoint';

export const fetchCompanyTripPoints = createAsyncThunk(
  'companyTripPoints/fetchList',
  async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    tripId?: string;
    pointId?: string;
    type?: string;
    isActive?: boolean;
  }) => {
    const response = await axiosInstance.get<TripPointListResponse>(
      '/company-trip-points/company',
      { params }
    );
    return response.data;
  }
);

export const createCompanyTripPoint = createAsyncThunk(
  'companyTripPoints/create',
  async (data: CreateTripPointRequest) => {
    const response = await axiosInstance.post<TripPointResponse>(
      '/company-trip-points/company',
      data
    );
    return response.data;
  }
);

export const updateCompanyTripPoint = createAsyncThunk(
  'companyTripPoints/update',
  async ({ id, data }: { id: string; data: UpdateTripPointRequest }) => {
    const response = await axiosInstance.put<TripPointResponse>(
      `/company-trip-points/company/${id}`,
      data
    );
    return response.data;
  }
);

export const deleteCompanyTripPoint = createAsyncThunk(
  'companyTripPoints/delete',
  async (id: string) => {
    await axiosInstance.delete(`/company-trip-points/company/${id}`);
    return id;
  }
);

export const toggleCompanyTripPointStatus = createAsyncThunk(
  'companyTripPoints/toggleStatus',
  async ({ id, isActive }: { id: string; isActive: boolean }) => {
    await axiosInstance.put(`/company-trip-points/company/${id}/toggle`, { isActive });
    return { id, isActive };
  }
);
