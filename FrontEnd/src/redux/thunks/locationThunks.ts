import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import type { LocationListPayload, LocationListResponse } from '@/types/location';

// using apiClient baseURL

// Fetch location list
export const fetchLocationList = createAsyncThunk<
  LocationListResponse,
  LocationListPayload,
  { rejectValue: string }
>('locations/fetchList', async (payload, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (payload.isActive !== undefined) {
      params.append('isActive', payload.isActive.toString());
    }
    if (payload.search) {
      params.append('search', payload.search);
    }
    if (payload.cityId) {
      params.append('cityId', payload.cityId);
    }
    if (payload.pageSize) {
      params.append('pageSize', payload.pageSize.toString());
    }
    if (payload.pageNumber) {
      params.append('pageNumber', payload.pageNumber.toString());
    }

  const response = await apiClient.get(`/locations/list?${params.toString()}`);
  return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch locations');
  }
});

// Create location
export const createLocation = createAsyncThunk<
  void,
  { name: string; cityId: string; isActive?: boolean },
  { rejectValue: string }
>('locations/create', async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await apiClient.post(`/locations`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create location');
  }
});

// Update location
export const updateLocation = createAsyncThunk<
  void,
  { id: string; data: Partial<{ name: string; cityId: string; isActive: boolean }> },
  { rejectValue: string }
>('locations/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await apiClient.put(`/locations/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update location');
  }
});

// Delete location
export const deleteLocation = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('locations/delete', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await apiClient.delete(`/locations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete location');
  }
});
