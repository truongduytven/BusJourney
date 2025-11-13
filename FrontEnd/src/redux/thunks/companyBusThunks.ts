import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import type { CreateBusRequest, UpdateBusRequest, BusListResponse, BusDetailResponse } from '../../types/bus';

export const fetchCompanyBuses = createAsyncThunk(
  'companyBus/fetchList',
  async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    typeBusId?: string;
  }) => {
    const response = await axiosInstance.get<BusListResponse>('/buses/company', { params });
    return response.data;
  }
);

export const fetchCompanyBusById = createAsyncThunk(
  'companyBus/fetchById',
  async (id: string) => {
    const response = await axiosInstance.get<BusDetailResponse>(`/buses/company/${id}`);
    return response.data.data;
  }
);

export const createCompanyBus = createAsyncThunk(
  'companyBus/create',
  async (payload: { data: CreateBusRequest; images?: File[] }) => {
    const formData = new FormData();
    formData.append('licensePlate', payload.data.licensePlate);
    formData.append('typeBusId', payload.data.typeBusId);
    
    if (payload.data.extensions && payload.data.extensions.length > 0) {
      formData.append('extensions', JSON.stringify(payload.data.extensions));
    }
    
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await axiosInstance.post<BusDetailResponse>('/buses/company', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
);

export const updateCompanyBus = createAsyncThunk(
  'companyBus/update',
  async ({ id, data, images }: { id: string; data: UpdateBusRequest; images?: File[] }) => {
    const formData = new FormData();
    
    if (data.licensePlate) {
      formData.append('licensePlate', data.licensePlate);
    }
    if (data.typeBusId) {
      formData.append('typeBusId', data.typeBusId);
    }
    if (data.extensions) {
      formData.append('extensions', JSON.stringify(data.extensions));
    }
    if (data.images) {
      formData.append('existingImages', JSON.stringify(data.images));
    }
    
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await axiosInstance.put<BusDetailResponse>(`/buses/company/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
);

export const deleteCompanyBus = createAsyncThunk(
  'companyBus/delete',
  async (id: string) => {
    await axiosInstance.delete(`/buses/company/${id}`);
    return id;
  }
);
