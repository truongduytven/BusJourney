import { createSlice } from '@reduxjs/toolkit';
import type { Trip } from '@/types/companyTrip';
import {
  fetchCompanyTrips,
  createCompanyTrip,
  updateCompanyTrip,
  toggleCompanyTripStatus,
  bulkToggleCompanyTripStatus,
} from '../thunks/companyTripThunks';

interface CompanyTripState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CompanyTripState = {
  trips: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
};

const companyTripSlice = createSlice({
  name: 'companyTrip',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompanyTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      .addCase(createCompanyTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanyTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.unshift(action.payload.data);
      })
      .addCase(createCompanyTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create trip';
      })
      .addCase(updateCompanyTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyTrip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((trip) => trip.id === action.payload.data.id);
        if (index !== -1) {
          state.trips[index] = action.payload.data;
        }
      })
      .addCase(updateCompanyTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update trip';
      })
      .addCase(toggleCompanyTripStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCompanyTripStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trips[index].status = action.payload.status;
        }
      })
      .addCase(toggleCompanyTripStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to toggle trip';
      })
      .addCase(bulkToggleCompanyTripStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkToggleCompanyTripStatus.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.ids.forEach((id) => {
          const index = state.trips.findIndex((t) => t.id === id);
          if (index !== -1) {
            state.trips[index].status = action.payload.status;
          }
        });
      })
      .addCase(bulkToggleCompanyTripStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to bulk toggle trips';
      });
  },
});

export default companyTripSlice.reducer;
