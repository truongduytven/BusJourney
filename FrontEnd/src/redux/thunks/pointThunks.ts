import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PointListPayload, PointListResponse } from '@/types/point';

const API_URL = import.meta.env.VITE_API_URL;

// Fetch point list
export const fetchPointList = createAsyncThunk<
  PointListResponse,
  PointListPayload,
  { rejectValue: string }
>('points/fetchList', async (payload, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (payload.isActive !== undefined) {
      params.append('isActive', payload.isActive.toString());
    }
    if (payload.search) {
      params.append('search', payload.search);
    }
    if (payload.type) {
      params.append('type', payload.type);
    }
    if (payload.pageSize) {
      params.append('pageSize', payload.pageSize.toString());
    }
    if (payload.pageNumber) {
      params.append('pageNumber', payload.pageNumber.toString());
    }

    const response = await axios.get(`${API_URL}/points/list?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch points');
  }
});

// Create point
export const createPoint = createAsyncThunk<
  void,
  { locationName: string; type: string; isActive?: boolean },
  { rejectValue: string }
>('points/create', async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.post(`${API_URL}/points`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create point');
  }
});

// Update point
export const updatePoint = createAsyncThunk<
  void,
  { id: string; data: Partial<{ locationName: string; type: string; isActive: boolean }> },
  { rejectValue: string }
>('points/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.put(`${API_URL}/points/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update point');
  }
});

// Delete point
export const deletePoint = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('points/delete', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.delete(`${API_URL}/points/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete point');
  }
});
