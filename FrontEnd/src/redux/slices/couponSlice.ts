import { createSlice } from '@reduxjs/toolkit';
import type { CouponListResponse } from '@/types/coupon';
import { 
  fetchCouponList, 
  createCoupon, 
  updateCoupon, 
  toggleCouponStatus,
  extendCoupon
} from '@/redux/thunks/couponThunks';

interface CouponState {
  couponList: CouponListResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  couponList: null,
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchCouponList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouponList.fulfilled, (state, action) => {
        state.loading = false;
        state.couponList = action.payload;
      })
      .addCase(fetchCouponList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle status
      .addCase(toggleCouponStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCouponStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Extend
      .addCase(extendCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extendCoupon.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(extendCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = couponSlice.actions;
export default couponSlice.reducer;
