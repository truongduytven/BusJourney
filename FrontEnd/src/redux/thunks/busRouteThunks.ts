import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import type { BusRouteListResponse, ApprovedRoutesResponse } from '@/types/busRoute';

// Fetch bus routes list
export const fetchBusRoutes = createAsyncThunk(
  'busRoutes/fetchBusRoutes',
  async (params: { page?: number; pageSize?: number; status?: boolean; search?: string } = {}) => {
    const { page = 1, pageSize = 10, status, search } = params;
    const queryParams: any = { page, pageSize };
    if (status !== undefined) queryParams.status = status;
    if (search) queryParams.search = search;
    
    const response = await apiClient.get<BusRouteListResponse>('/bus-routes', {
      params: queryParams
    });
    return response.data;
  }
);

// Fetch approved routes (for selection)
export const fetchApprovedRoutes = createAsyncThunk(
  'busRoutes/fetchApprovedRoutes',
  async (params: { page?: number; pageSize?: number } = {}) => {
    const { page = 1, pageSize = 100 } = params;
    const response = await apiClient.get<ApprovedRoutesResponse>('/bus-routes/approved-routes', {
      params: { page, pageSize }
    });
    return response.data;
  }
);

// Create bus route
export const createBusRoute = createAsyncThunk(
  'busRoutes/createBusRoute',
  async (data: { routeId: string; status?: boolean }) => {
    const response = await apiClient.post('/bus-routes', data);
    return response.data;
  }
);

// Update bus route status
export const updateBusRouteStatus = createAsyncThunk(
  'busRoutes/updateBusRouteStatus',
  async ({ id, status }: { id: string; status: boolean }) => {
    const response = await apiClient.patch(`/bus-routes/${id}/status`, { status });
    return response.data;
  }
);

// Delete bus route
export const deleteBusRoute = createAsyncThunk(
  'busRoutes/deleteBusRoute',
  async (id: string) => {
    const response = await apiClient.delete(`/bus-routes/${id}`);
    return response.data;
  }
);
