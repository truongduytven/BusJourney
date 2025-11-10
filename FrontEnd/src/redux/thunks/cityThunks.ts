import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '@/lib/axios';
import type { City, CityListPayload, CityListResponse, CreateCityPayload, UpdateCityPayload } from "@/types/city";

interface ResponseData {
  message: string;
  data: City[];
}

interface CityListResponseData {
  message: string;
  data: CityListResponse;
}

interface CityResponseData {
  message: string;
  data: City;
}

export const fetchCities = createAsyncThunk<City[]>(
  "cities/fetch",
  async () => {
    const res = await apiClient.get<ResponseData>(`/cities`);
    return res.data.data;
  }
);

export const fetchCityList = createAsyncThunk<CityListResponse, CityListPayload>(
  "cities/fetchList",
  async (payload: CityListPayload, { rejectWithValue }) => {
    try {
      const { search, isActive, pageSize, pageNumber } = payload;
      const token = localStorage.getItem("authToken");
      
      if (!token) throw new Error("No token found");
      
      const params: any = { pageSize, pageNumber };
      if (search) params.search = search;
      if (isActive !== undefined) params.isActive = isActive;
      
      const response = await apiClient.get<CityListResponseData>(`/cities/list`, { params, headers: { Authorization: `Bearer ${token}` } });
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch city list failed");
    }
  }
);

export const createCity = createAsyncThunk<City, CreateCityPayload>(
  "cities/create",
  async (payload: CreateCityPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) throw new Error("No token found");
      
      const response = await apiClient.post<CityResponseData>(`/cities`, payload, { headers: { Authorization: `Bearer ${token}` } });
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Create city failed");
    }
  }
);

export const updateCity = createAsyncThunk<
  City,
  { id: string; data: UpdateCityPayload }
>(
  "cities/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) throw new Error("No token found");
      
      const response = await apiClient.put<CityResponseData>(`/cities/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Update city failed");
    }
  }
);

export const deleteCity = createAsyncThunk<void, string>(
  "cities/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) throw new Error("No token found");
      
  await apiClient.delete(`/cities/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete city failed");
    }
  }
);
