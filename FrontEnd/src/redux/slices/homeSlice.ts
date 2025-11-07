import { createSlice } from '@reduxjs/toolkit';
import type { FeaturedRoute, ActiveCoupon, FeaturedReview } from '@/types/home';
import {
  fetchFeaturedRoutes,
  fetchActiveCoupons,
  fetchFeaturedReviews,
} from '@/redux/thunks/homeThunks';

export interface HomeState {
  featuredRoutes: FeaturedRoute[];
  activeCoupons: ActiveCoupon[];
  featuredReviews: FeaturedReview[];
  loading: {
    routes: boolean;
    coupons: boolean;
    reviews: boolean;
  };
  error: {
    routes: string | null;
    coupons: string | null;
    reviews: string | null;
  };
}

const initialState: HomeState = {
  featuredRoutes: [],
  activeCoupons: [],
  featuredReviews: [],
  loading: {
    routes: false,
    coupons: false,
    reviews: false,
  },
  error: {
    routes: null,
    coupons: null,
    reviews: null,
  },
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        routes: null,
        coupons: null,
        reviews: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Featured Routes
      .addCase(fetchFeaturedRoutes.pending, (state) => {
        state.loading.routes = true;
        state.error.routes = null;
      })
      .addCase(fetchFeaturedRoutes.fulfilled, (state, action) => {
        state.loading.routes = false;
        state.featuredRoutes = action.payload.data;
      })
      .addCase(fetchFeaturedRoutes.rejected, (state, action) => {
        state.loading.routes = false;
        state.error.routes = action.payload as string;
      })
      // Active Coupons
      .addCase(fetchActiveCoupons.pending, (state) => {
        state.loading.coupons = true;
        state.error.coupons = null;
      })
      .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
        state.loading.coupons = false;
        state.activeCoupons = action.payload.data;
      })
      .addCase(fetchActiveCoupons.rejected, (state, action) => {
        state.loading.coupons = false;
        state.error.coupons = action.payload as string;
      })
      // Featured Reviews
      .addCase(fetchFeaturedReviews.pending, (state) => {
        state.loading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(fetchFeaturedReviews.fulfilled, (state, action) => {
        state.loading.reviews = false;
        state.featuredReviews = action.payload.data;
      })
      .addCase(fetchFeaturedReviews.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error.reviews = action.payload as string;
      });
  },
});

export const { clearErrors } = homeSlice.actions;
export default homeSlice.reducer;
