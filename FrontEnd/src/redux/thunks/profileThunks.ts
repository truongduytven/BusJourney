import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import type { UpdateProfileData, ChangePasswordData, ProfileResponse } from '@/types/profile';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('accessToken');

/**
 * Get user profile
 */
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await apiClient.get<ProfileResponse>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = getAuthToken();
      const response = await apiClient.patch<ProfileResponse>('/auth/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<ProfileResponse>('/auth/profile/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
  const token = getAuthToken();
      
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return rejectWithValue('Mật khẩu xác nhận không khớp');
      }

      const response = await apiClient.patch('/auth/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, { headers: { Authorization: `Bearer ${token}` } });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể đổi mật khẩu'
      );
    }
  }
);
