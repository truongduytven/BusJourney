import { createSlice } from '@reduxjs/toolkit';
import type { LocationListResponse } from '@/types/location';
import {
  fetchLocationList,
  createLocation,
  updateLocation,
  deleteLocation,
} from '@/redux/thunks/locationThunks';

interface LocationState {
  locationList: LocationListResponse;
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  locationList: {
    locations: [],
    totalLocations: 0,
    totalPage: 0,
    currentPage: 1,
    pageSize: 10,
  },
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    clearLocationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch location list
    builder
      .addCase(fetchLocationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationList.fulfilled, (state, action) => {
        state.loading = false;
        state.locationList = action.payload;
      })
      .addCase(fetchLocationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create location
    builder
      .addCase(createLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update location
    builder
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete location
    builder
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLocationError } = locationSlice.actions;
export default locationSlice.reducer;
