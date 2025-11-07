import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type {
  FeaturedRoute,
  ActiveCoupon,
  FeaturedReview,
  HomeDataResponse,
} from '@/types/home';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch featured routes for homepage
 */
export const fetchFeaturedRoutes = createAsyncThunk(
  'home/fetchFeaturedRoutes',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const response = await axios.get<HomeDataResponse<FeaturedRoute>>(
        `${API_URL}/home/featured-routes`,
        { params: { limit } }
      );
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
      const response = await axios.get<HomeDataResponse<ActiveCoupon>>(
        `${API_URL}/home/active-coupons`,
        { params: { limit } }
      );
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
      const response = await axios.get<HomeDataResponse<FeaturedReview>>(
        `${API_URL}/home/featured-reviews`,
        { params: { limit } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải đánh giá'
      );
    }
  }
);
