import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { 
  PartnerRegistrationData, 
  PartnerFilters, 
  PartnerListResponse,
  Partner,
  PartnerStatus,
  PartnerStats
} from '@/types/partner';

const API_URL = import.meta.env.VITE_API_URL;

// Register partner (public - no auth required)
export const registerPartner = createAsyncThunk<
  Partner,
  PartnerRegistrationData,
  { rejectValue: string }
>('partners/register', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/partners/register`, data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Đăng ký thất bại');
  }
});

// Fetch partner list (admin only)
export const fetchPartnerList = createAsyncThunk<
  PartnerListResponse,
  PartnerFilters,
  { rejectValue: string }
>('partners/fetchList', async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.pageSize) {
      params.append('pageSize', filters.pageSize.toString());
    }
    if (filters.pageNumber) {
      params.append('pageNumber', filters.pageNumber.toString());
    }

    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/partners?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Không thể tải danh sách đối tác');
  }
});

// Update partner status (admin only)
export const updatePartnerStatus = createAsyncThunk<
  Partner,
  { partnerId: string; status: PartnerStatus },
  { rejectValue: string }
>('partners/updateStatus', async ({ partnerId, status }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.patch(
      `${API_URL}/partners/${partnerId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Cập nhật trạng thái thất bại');
  }
});

// Delete partner (admin only)
export const deletePartner = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('partners/delete', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.delete(`${API_URL}/partners/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Xóa thất bại');
  }
});

// Fetch partner statistics (admin only)
export const fetchPartnerStats = createAsyncThunk<
  PartnerStats,
  void,
  { rejectValue: string }
>('partners/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/partners/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Không thể tải thống kê');
  }
});
