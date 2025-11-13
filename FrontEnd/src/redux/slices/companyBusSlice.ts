import { createSlice } from '@reduxjs/toolkit';
import type { Bus } from '../../types/bus';
import {
  fetchCompanyBuses,
  fetchCompanyBusById,
  createCompanyBus,
  updateCompanyBus,
  deleteCompanyBus
} from '../thunks/companyBusThunks';

interface CompanyBusState {
  buses: Bus[];
  currentBus: Bus | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CompanyBusState = {
  buses: [],
  currentBus: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  }
};

const companyBusSlice = createSlice({
  name: 'companyBus',
  initialState,
  reducers: {
    clearCurrentBus: (state) => {
      state.currentBus = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyBuses.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompanyBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải danh sách xe';
      })
      .addCase(fetchCompanyBusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyBusById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBus = action.payload;
      })
      .addCase(fetchCompanyBusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải thông tin xe';
      })
      .addCase(createCompanyBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanyBus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCompanyBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tạo xe';
      })
      .addCase(updateCompanyBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyBus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCompanyBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi cập nhật xe';
      })
      .addCase(deleteCompanyBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompanyBus.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = state.buses.filter((bus) => bus.id !== action.payload);
      })
      .addCase(deleteCompanyBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi xóa xe';
      });
  }
});

export const { clearCurrentBus, clearError } = companyBusSlice.actions;
export default companyBusSlice.reducer;
