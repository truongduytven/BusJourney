import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { UpdateProfileData, ChangePasswordData, ProfileResponse } from '@/types/profile';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
  return token;
};

// Create axios instance with auth header
const createAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Get user profile
 */
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const api = createAuthAxios();
      const response = await api.get<ProfileResponse>('/auth/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải thông tin tài khoản'
      );
    }
  }
);

/**
 * Update user profile
 */
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (updateData: UpdateProfileData, { rejectWithValue }) => {
    try {
      const api = createAuthAxios();
      const response = await api.patch<ProfileResponse>('/auth/profile', updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể cập nhật thông tin'
      );
    }
  }
);

/**
 * Upload avatar
 */
export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const api = createAuthAxios();
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post<ProfileResponse>('/auth/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể upload avatar'
      );
    }
  }
);

/**
 * Change password
 */
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (passwordData: ChangePasswordData, { rejectWithValue }) => {
    try {
      const api = createAuthAxios();
      
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return rejectWithValue('Mật khẩu xác nhận không khớp');
      }

      const response = await api.patch('/auth/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể đổi mật khẩu'
      );
    }
  }
);
