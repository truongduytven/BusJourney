import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import type {
  FeaturedRoute,
  ActiveCoupon,
  FeaturedReview,
  HomeDataResponse,
} from '@/types/home';

// using apiClient baseURL

/**
 * Fetch featured routes for homepage
 */
export const fetchFeaturedRoutes = createAsyncThunk(
  'home/fetchFeaturedRoutes',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<HomeDataResponse<FeaturedRoute>>('/home/featured-routes', { params: { limit } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải tuyến đường nổi bật'
      );
    }
  }
);

/**
 * Fetch active coupons for homepage
 */
export const fetchActiveCoupons = createAsyncThunk(
  'home/fetchActiveCoupons',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<HomeDataResponse<ActiveCoupon>>('/home/active-coupons', { params: { limit } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải voucher'
      );
    }
  }
);

/**
 * Fetch featured reviews for homepage
 */
export const fetchFeaturedReviews = createAsyncThunk(
  'home/fetchFeaturedReviews',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<HomeDataResponse<FeaturedReview>>('/home/featured-reviews', { params: { limit } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải đánh giá'
      );
    }
  }
);
