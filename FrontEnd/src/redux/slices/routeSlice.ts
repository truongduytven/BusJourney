import { createSlice } from '@reduxjs/toolkit';
import type { Route } from '@/types/route';
import { fetchRoutes, createRouteAsCompany, createRouteAsAdmin, updateRouteStatus, deleteRoute } from '../thunks/routeThunks';

interface RouteState {
  data: Route[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null;
}

const initialState: RouteState = {
  data: [],
  loading: false,
  error: null,
  pagination: null,
};

const routeSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch routes
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải danh sách tuyến đường';
      });

    // Create route as company
    builder
      .addCase(createRouteAsCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRouteAsCompany.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createRouteAsCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tạo yêu cầu tuyến đường';
      });

    // Create route as admin
    builder
      .addCase(createRouteAsAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRouteAsAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createRouteAsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tạo tuyến đường';
      });

    // Update route status
    builder
      .addCase(updateRouteStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRouteStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateRouteStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi cập nhật trạng thái';
      });

    // Delete route
    builder
      .addCase(deleteRoute.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRoute.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi xóa tuyến đường';
      });
  },
});

export default routeSlice.reducer;
