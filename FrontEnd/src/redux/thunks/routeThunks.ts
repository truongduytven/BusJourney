import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import type { RouteListResponse } from '@/types/route';

// Fetch routes list
export const fetchRoutes = createAsyncThunk(
  'routes/fetchRoutes',
  async (params: { page?: number; pageSize?: number } = {}) => {
    const { page = 1, pageSize = 10 } = params;
    const response = await apiClient.get<RouteListResponse>('/routes', {
      params: { page, pageSize }
    });
    return response.data;
  }
);

// Company tạo yêu cầu route (Pending)
export const createRouteAsCompany = createAsyncThunk(
  'routes/createRouteAsCompany',
  async (data: { startLocationId: string; endLocationId: string; distance: number }) => {
    const response = await apiClient.post('/routes', data);
    return response.data;
  }
);

// Admin tạo route (Approved)
export const createRouteAsAdmin = createAsyncThunk(
  'routes/createRouteAsAdmin',
  async (data: { startLocationId: string; endLocationId: string; distance: number }) => {
    const response = await apiClient.post('/routes/admin-create', data);
    return response.data;
  }
);

// Admin cập nhật status
export const updateRouteStatus = createAsyncThunk(
  'routes/updateRouteStatus',
  async ({ id, status }: { id: string; status: 'Approved' | 'Rejected' | 'Pending' }) => {
    const response = await apiClient.patch(`/routes/${id}/status`, { status });
    return response.data;
  }
);

// Admin xóa route
export const deleteRoute = createAsyncThunk(
  'routes/deleteRoute',
  async (id: string) => {
    const response = await apiClient.delete(`/routes/${id}`);
    return response.data;
  }
);

// Admin bulk update status nhiều routes
export const bulkUpdateRouteStatus = createAsyncThunk(
  'routes/bulkUpdateRouteStatus',
  async ({ ids, status }: { ids: string[]; status: 'Approved' | 'Rejected' | 'Pending' }) => {
    const response = await apiClient.post('/routes/bulk-update-status', { ids, status });
    return response.data;
  }
);
