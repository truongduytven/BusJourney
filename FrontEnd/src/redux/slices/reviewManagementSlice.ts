import { createSlice } from '@reduxjs/toolkit';
import type { Review } from '@/types/review';
import {
  fetchAdminReviews,
  fetchCompanyReviews,
  updateAdminReview,
  updateCompanyReview,
  deleteAdminReview,
  deleteCompanyReview,
  toggleAdminReviewVisibility,
} from '../thunks/reviewThunks';

interface ReviewManagementState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalReviews: number;
    totalPage: number;
  };
}

const initialState: ReviewManagementState = {
  reviews: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalReviews: 0,
    totalPage: 0,
  },
};

const reviewManagementSlice = createSlice({
  name: 'reviewManagement',
  initialState,
  reducers: {
    resetReviewManagementState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch admin reviews
    builder.addCase(fetchAdminReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload.reviews;
      state.pagination = {
        currentPage: action.payload.currentPage,
        pageSize: action.payload.pageSize,
        totalReviews: action.payload.totalReviews,
        totalPage: action.payload.totalPage,
      };
    });
    builder.addCase(fetchAdminReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch reviews';
    });

    // Fetch company reviews
    builder.addCase(fetchCompanyReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCompanyReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload.reviews;
      state.pagination = {
        currentPage: action.payload.currentPage,
        pageSize: action.payload.pageSize,
        totalReviews: action.payload.totalReviews,
        totalPage: action.payload.totalPage,
      };
    });
    builder.addCase(fetchCompanyReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch reviews';
    });

    // Update admin review
    builder.addCase(updateAdminReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAdminReview.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateAdminReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update review';
    });

    // Update company review
    builder.addCase(updateCompanyReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCompanyReview.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateCompanyReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update review';
    });

    // Delete admin review
    builder.addCase(deleteAdminReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAdminReview.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteAdminReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete review';
    });

    // Delete company review
    builder.addCase(deleteCompanyReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCompanyReview.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteCompanyReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete review';
    });

    // Toggle admin review visibility
    builder.addCase(toggleAdminReviewVisibility.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(toggleAdminReviewVisibility.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(toggleAdminReviewVisibility.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to toggle review visibility';
    });
  },
});

export const { resetReviewManagementState } = reviewManagementSlice.actions;
export default reviewManagementSlice.reducer;
