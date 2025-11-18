import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import type { ReviewListResponse, ReviewFilters, UpdateReviewRequest } from '@/types/review';

// Admin thunks
export const fetchAdminReviews = createAsyncThunk(
  'reviewManagement/fetchAdminReviews',
  async ({ search, rating, isVisible, tripId, userId, pageSize = 10, pageNumber = 1 }: ReviewFilters & { pageSize?: number; pageNumber?: number }) => {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (rating) params.append('rating', rating.toString());
    if (isVisible !== undefined) params.append('isVisible', isVisible.toString());
    if (tripId) params.append('tripId', tripId);
    if (userId) params.append('userId', userId);
    params.append('pageSize', pageSize.toString());
    params.append('pageNumber', pageNumber.toString());

    const response = await apiClient.get<{ data: ReviewListResponse }>(`/admin-reviews/list?${params.toString()}`);
    return response.data.data;
  }
);

export const fetchAdminReviewById = createAsyncThunk(
  'reviewManagement/fetchAdminReviewById',
  async (id: string) => {
    const response = await apiClient.get(`/admin-reviews/${id}`);
    return response.data.data;
  }
);

export const updateAdminReview = createAsyncThunk(
  'reviewManagement/updateAdminReview',
  async ({ id, data }: { id: string; data: UpdateReviewRequest }) => {
    const response = await apiClient.put(`/admin-reviews/${id}`, data);
    return response.data.data;
  }
);

export const deleteAdminReview = createAsyncThunk(
  'reviewManagement/deleteAdminReview',
  async (id: string) => {
    await apiClient.delete(`/admin-reviews/${id}`);
    return id;
  }
);

export const toggleAdminReviewVisibility = createAsyncThunk(
  'reviewManagement/toggleAdminReviewVisibility',
  async (id: string) => {
    const response = await apiClient.patch(`/admin-reviews/${id}/toggle-visibility`);
    return response.data.data;
  }
);

// Company thunks
export const fetchCompanyReviews = createAsyncThunk(
  'reviewManagement/fetchCompanyReviews',
  async ({ search, rating, isVisible, tripId, userId, pageSize = 10, pageNumber = 1 }: ReviewFilters & { pageSize?: number; pageNumber?: number }) => {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (rating) params.append('rating', rating.toString());
    if (isVisible !== undefined) params.append('isVisible', isVisible.toString());
    if (tripId) params.append('tripId', tripId);
    if (userId) params.append('userId', userId);
    params.append('pageSize', pageSize.toString());
    params.append('pageNumber', pageNumber.toString());

    const response = await apiClient.get<{ data: ReviewListResponse }>(`/company-reviews/list?${params.toString()}`);
    return response.data.data;
  }
);

export const fetchCompanyReviewById = createAsyncThunk(
  'reviewManagement/fetchCompanyReviewById',
  async (id: string) => {
    const response = await apiClient.get(`/company-reviews/${id}`);
    return response.data.data;
  }
);

export const updateCompanyReview = createAsyncThunk(
  'reviewManagement/updateCompanyReview',
  async ({ id, data }: { id: string; data: UpdateReviewRequest }) => {
    const response = await apiClient.put(`/company-reviews/${id}`, data);
    return response.data.data;
  }
);

export const deleteCompanyReview = createAsyncThunk(
  'reviewManagement/deleteCompanyReview',
  async (id: string) => {
    await apiClient.delete(`/company-reviews/${id}`);
    return id;
  }
);
