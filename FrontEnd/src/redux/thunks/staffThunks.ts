import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type {
  StaffListPayload,
  StaffListResponse,
  CreateStaffPayload,
  UpdateStaffPayload,
  Staff,
} from '@/types/staff';

const API_URL = import.meta.env.VITE_API_URL;

// Fetch staff list
export const fetchStaffList = createAsyncThunk<
  StaffListResponse,
  StaffListPayload,
  { rejectValue: string }
>('staff/fetchList', async (payload, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();

    if (payload.search) {
      params.append('search', payload.search);
    }
    if (payload.isActive !== undefined) {
      params.append('isActive', payload.isActive.toString());
    }
    if (payload.pageSize) {
      params.append('pageSize', payload.pageSize.toString());
    }
    if (payload.pageNumber) {
      params.append('pageNumber', payload.pageNumber.toString());
    }

    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/company/staff/list?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff');
  }
});

// Get staff by ID
export const fetchStaffById = createAsyncThunk<
  Staff,
  string,
  { rejectValue: string }
>('staff/fetchById', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/company/staff/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff details');
  }
});

// Create staff
export const createStaff = createAsyncThunk<
  Staff,
  CreateStaffPayload,
  { rejectValue: string }
>('staff/create', async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${API_URL}/company/staff`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create staff');
  }
});

// Update staff
export const updateStaff = createAsyncThunk<
  Staff,
  { id: string; data: UpdateStaffPayload },
  { rejectValue: string }
>('staff/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.put(`${API_URL}/company/staff/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update staff');
  }
});

// Toggle staff status
export const toggleStaffStatus = createAsyncThunk<
  Staff,
  string,
  { rejectValue: string }
>('staff/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.patch(
      `${API_URL}/company/staff/${id}/toggle-status`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to toggle staff status');
  }
});

// Bulk toggle staff active status
export const bulkToggleStaffActive = createAsyncThunk<
  { updatedCount: number; isActive: boolean },
  { staffIds: string[]; isActive: boolean },
  { rejectValue: string }
>('staff/bulkToggleActive', async ({ staffIds, isActive }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.put(
      `${API_URL}/company/staff/bulk-toggle-active`,
      { staffIds, isActive },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to bulk toggle staff status');
  }
});
