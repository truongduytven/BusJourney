import { createAsyncThunk } from "@reduxjs/toolkit";
import type { TypeBusListResponse, TypeBusCreateRequest, TypeBusUpdateRequest } from "@/types/typeBus";
import apiClient from "@/lib/axios";

// Fetch company's type buses
export const fetchCompanyTypeBuses = createAsyncThunk(
  "companyTypeBuses/fetchList",
  async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    isFloors?: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<TypeBusListResponse>(
        `/type-buses/company`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy danh sách loại xe");
    }
  }
);

// Fetch company's type bus by ID
export const fetchCompanyTypeBusById = createAsyncThunk(
  "companyTypeBuses/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/type-buses/company/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy thông tin loại xe");
    }
  }
);

// Create company's type bus
export const createCompanyTypeBus = createAsyncThunk(
  "companyTypeBuses/create",
  async (data: TypeBusCreateRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/type-buses/company`,
        data
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi tạo loại xe");
    }
  }
);

// Update company's type bus
export const updateCompanyTypeBus = createAsyncThunk(
  "companyTypeBuses/update",
  async ({ id, data }: { id: string; data: TypeBusUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/type-buses/company/${id}`,
        data
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật loại xe");
    }
  }
);

// Delete company's type bus
export const deleteCompanyTypeBus = createAsyncThunk(
  "companyTypeBuses/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/type-buses/company/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa loại xe");
    }
  }
);
