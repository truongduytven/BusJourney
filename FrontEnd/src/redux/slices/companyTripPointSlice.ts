import { createSlice } from '@reduxjs/toolkit';
import type { TripPoint } from '@/types/companyTripPoint';
import {
  fetchCompanyTripPoints,
  createCompanyTripPoint,
  updateCompanyTripPoint,
  deleteCompanyTripPoint,
  toggleCompanyTripPointStatus
} from '../thunks/companyTripPointThunks';

interface CompanyTripPointState {
  tripPoints: TripPoint[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CompanyTripPointState = {
  tripPoints: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  }
};

const companyTripPointSlice = createSlice({
  name: 'companyTripPoints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyTripPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyTripPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.tripPoints = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompanyTripPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trip points';
      })
      .addCase(createCompanyTripPoint.fulfilled, (state, action) => {
        state.tripPoints.unshift(action.payload.data);
      })
      .addCase(updateCompanyTripPoint.fulfilled, (state, action) => {
        const index = state.tripPoints.findIndex((tp) => tp.id === action.payload.data.id);
        if (index !== -1) {
          state.tripPoints[index] = action.payload.data;
        }
      })
      .addCase(deleteCompanyTripPoint.fulfilled, (state, action) => {
        state.tripPoints = state.tripPoints.filter((tp) => tp.id !== action.payload);
      })
      .addCase(toggleCompanyTripPointStatus.fulfilled, (state, action) => {
        const index = state.tripPoints.findIndex((tp) => tp.id === action.payload.id);
        if (index !== -1) {
          state.tripPoints[index].isActive = action.payload.isActive;
        }
      });
  }
});

export default companyTripPointSlice.reducer;
