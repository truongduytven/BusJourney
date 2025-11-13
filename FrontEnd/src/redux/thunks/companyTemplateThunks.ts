import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import type { CreateTemplateRequest, UpdateTemplateRequest, TemplateListResponse, TemplateResponse } from '@/types/companyTemplate';

export const fetchCompanyTemplates = createAsyncThunk(
  'companyTemplate/fetchTemplates',
  async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    busId?: string;
    busRouteId?: string;
    isActive?: boolean;
  }) => {
    const response = await axiosInstance.get<TemplateListResponse>('/templates/company', { params });
    return response.data;
  }
);

export const createCompanyTemplate = createAsyncThunk(
  'companyTemplate/createTemplate',
  async (data: CreateTemplateRequest) => {
    const response = await axiosInstance.post<TemplateResponse>('/templates/company', data);
    return response.data;
  }
);

export const updateCompanyTemplate = createAsyncThunk(
  'companyTemplate/updateTemplate',
  async ({ id, data }: { id: string; data: UpdateTemplateRequest }) => {
    const response = await axiosInstance.put<TemplateResponse>(`/templates/company/${id}`, data);
    return response.data;
  }
);

export const toggleCompanyTemplateActive = createAsyncThunk(
  'companyTemplate/toggleActive',
  async ({ id, isActive }: { id: string; isActive: boolean }) => {
    await axiosInstance.put(`/templates/company/${id}/toggle`, { isActive });
    return { id, isActive };
  }
);

export const bulkToggleCompanyTemplateActive = createAsyncThunk(
  'companyTemplate/bulkToggleActive',
  async ({ ids, isActive }: { ids: string[]; isActive: boolean }) => {
    await axiosInstance.put('/templates/company/bulk-toggle', { ids, isActive });
    return { ids, isActive };
  }
);
