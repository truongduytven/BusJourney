import { createSlice } from '@reduxjs/toolkit';
import type { BusRoute, ApprovedRoute } from '@/types/busRoute';
import {
  fetchBusRoutes,
  fetchApprovedRoutes,
  createBusRoute,
  updateBusRouteStatus,
  deleteBusRoute,
} from '../thunks/busRouteThunks';

interface BusRouteState {
  data: BusRoute[];
  approvedRoutes: ApprovedRoute[];
  loading: boolean;
  error: string | null;
}

const initialState: BusRouteState = {
  data: [],
  approvedRoutes: [],
  loading: false,
  error: null,
};

const busRouteSlice = createSlice({
  name: 'busRoutes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch bus routes
    builder
      .addCase(fetchBusRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchBusRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải danh sách tuyến xe';
      });

    // Fetch approved routes
    builder
      .addCase(fetchApprovedRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedRoutes = action.payload.data;
      })
      .addCase(fetchApprovedRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải danh sách tuyến đường';
      });

    // Create bus route
    builder
      .addCase(createBusRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusRoute.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBusRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi thêm tuyến xe';
      });

    // Update bus route status
    builder
      .addCase(updateBusRouteStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusRouteStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBusRouteStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi cập nhật trạng thái';
      });

    // Delete bus route
    builder
      .addCase(deleteBusRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBusRoute.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBusRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi xóa tuyến xe';
      });
  },
});

export default busRouteSlice.reducer;
