import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { CouponListPayload, CouponListResponse } from '@/types/coupon';

const API_URL = import.meta.env.VITE_API_URL;

// Fetch coupon list
export const fetchCouponList = createAsyncThunk<
  CouponListResponse,
  CouponListPayload,
  { rejectValue: string }
>('coupons/fetchList', async (payload, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (payload.status) {
      params.append('status', payload.status);
    }
    if (payload.search) {
      params.append('search', payload.search);
    }
    if (payload.companyId) {
      params.append('companyId', payload.companyId);
    }
    if (payload.discountType) {
      params.append('discountType', payload.discountType);
    }
    if (payload.pageSize) {
      params.append('pageSize', payload.pageSize.toString());
    }
    if (payload.pageNumber) {
      params.append('pageNumber', payload.pageNumber.toString());
    }

    const response = await axios.get(`${API_URL}/coupon-management/list?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch coupons');
  }
});

// Create coupon
export const createCoupon = createAsyncThunk<
  void,
  {
    description: string;
    discountType: string;
    discountValue: number;
    maxDiscountValue?: number;
    maxUses: number;
    validFrom: string;
    validTo: string;
    status?: string;
    companyId?: string;
    createdBy: string;
  },
  { rejectValue: string }
>('coupons/create', async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.post(`${API_URL}/coupon-management`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create coupon');
  }
});

// Update coupon
export const updateCoupon = createAsyncThunk<
  void,
  {
    id: string;
    data: Partial<{
      description: string;
      discountType: string;
      discountValue: number;
      maxDiscountValue: number;
      maxUses: number;
      validFrom: string;
      validTo: string;
      status: string;
      companyId: string;
    }>;
  },
  { rejectValue: string }
>('coupons/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.put(`${API_URL}/coupon-management/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update coupon');
  }
});

// Toggle coupon status
export const toggleCouponStatus = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('coupons/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.patch(`${API_URL}/coupon-management/${id}/toggle-status`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to toggle coupon status');
  }
});

// Extend coupon expiration date
export const extendCoupon = createAsyncThunk<
  void,
  { id: string; validTo: string },
  { rejectValue: string }
>('coupons/extend', async ({ id, validTo }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.patch(`${API_URL}/coupon-management/${id}/extend`, 
      { validTo }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to extend coupon');
  }
});
