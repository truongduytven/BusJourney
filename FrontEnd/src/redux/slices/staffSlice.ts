import { createSlice } from '@reduxjs/toolkit';
import type { StaffState } from '@/types/staff';
import {
  fetchStaffList,
  fetchStaffById,
  createStaff,
  updateStaff,
  toggleStaffStatus,
  bulkToggleStaffActive,
} from '@/redux/thunks/staffThunks';

const initialState: StaffState = {
  staffList: [],
  currentStaff: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    pageSize: 10,
    pageNumber: 1,
    totalPages: 0,
  },
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentStaff: (state) => {
      state.currentStaff = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchStaffList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffList.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStaffList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by ID
      .addCase(fetchStaffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStaff = action.payload;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle status
      .addCase(toggleStaffStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleStaffStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleStaffStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Bulk toggle active
      .addCase(bulkToggleStaffActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkToggleStaffActive.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bulkToggleStaffActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentStaff } = staffSlice.actions;
export default staffSlice.reducer;
