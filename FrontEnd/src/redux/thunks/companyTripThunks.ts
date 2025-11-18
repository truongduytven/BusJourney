import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import type { TripListResponse, TripResponse, CreateTripRequest, CreateBulkTripRequest } from '@/types/companyTrip';

export const fetchCompanyTrips = createAsyncThunk(
  'companyTrip/fetchTrips',
  async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    busId?: string;
    busRouteId?: string;
    templateId?: string;
    status?: boolean;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axiosInstance.get<TripListResponse>('/company-trips/company', { params });
    return response.data;
  }
);

export const createCompanyTrip = createAsyncThunk(
  'companyTrip/createTrip',
  async (data: CreateTripRequest) => {
    const response = await axiosInstance.post<TripResponse>('/company-trips/company', data);
    return response.data;
  }
);

export const createBulkCompanyTrips = createAsyncThunk(
  'companyTrip/createBulkTrips',
  async (data: CreateBulkTripRequest) => {
    const response = await axiosInstance.post('/company-trips/company/bulk', data);
    return response.data;
  }
);

export const updateCompanyTrip = createAsyncThunk(
  'companyTrip/updateTrip',
  async ({ id, data }: { id: string; data: Partial<CreateTripRequest> }) => {
    const response = await axiosInstance.put<TripResponse>(`/company-trips/company/${id}`, data);
    return response.data;
  }
);

export const toggleCompanyTripStatus = createAsyncThunk(
  'companyTrip/toggleStatus',
  async ({ id, status }: { id: string; status: boolean }) => {
    await axiosInstance.put(`/company-trips/company/${id}/toggle`, { status });
    return { id, status };
  }
);

export const bulkToggleCompanyTripStatus = createAsyncThunk(
  'companyTrip/bulkToggleStatus',
  async ({ ids, status }: { ids: string[]; status: boolean }) => {
    await axiosInstance.put('/company-trips/company/bulk-toggle', { ids, status });
    return { ids, status };
  }
);
