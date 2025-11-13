import { createAsyncThunk } from "@reduxjs/toolkit";
import type { TypeBusListResponse, TypeBusCreateRequest, TypeBusUpdateRequest } from "@/types/typeBus";
import apiClient from "@/lib/axios";



// Fetch type buses list with pagination
export const fetchTypeBuses = createAsyncThunk(
  'typeBuses/fetchList',
  async (params: { page?: number; pageSize?: number; search?: string; isFloors?: boolean }) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get<TypeBusListResponse>(`/type-buses`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  }
);

// Get type bus by ID
export const fetchTypeBusById = createAsyncThunk(
  'typeBuses/fetchById',
  async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get(`/type-buses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  }
);

// Create new type bus
export const createTypeBus = createAsyncThunk(
  'typeBuses/create',
  async (data: TypeBusCreateRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.post(`/type-buses`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

// Update type bus
export const updateTypeBus = createAsyncThunk(
  'typeBuses/update',
  async ({ id, data }: { id: string; data: TypeBusUpdateRequest }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.put(`/type-buses/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

// Delete type bus
export const deleteTypeBus = createAsyncThunk(
  'typeBuses/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/type-buses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

// Bulk update type buses
export const bulkUpdateTypeBuses = createAsyncThunk(
  'typeBuses/bulkUpdate',
  async ({ ids, isFloors }: { ids: string[]; isFloors: boolean }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.patch(`/type-buses/bulk/update`, { ids, isFloors }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { ids, isFloors };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);

