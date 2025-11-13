import { createSlice } from "@reduxjs/toolkit";
import type { TypeBus } from "@/types/typeBus";
import {
  fetchCompanyTypeBuses,
  fetchCompanyTypeBusById,
  createCompanyTypeBus,
  updateCompanyTypeBus,
  deleteCompanyTypeBus,
} from "../thunks/companyTypeBusThunks";

interface CompanyTypeBusState {
  data: TypeBus[];
  selectedTypeBus: TypeBus | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CompanyTypeBusState = {
  data: [],
  selectedTypeBus: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
};

const companyTypeBusSlice = createSlice({
  name: "companyTypeBuses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTypeBus: (state) => {
      state.selectedTypeBus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchCompanyTypeBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyTypeBuses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompanyTypeBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by ID
      .addCase(fetchCompanyTypeBusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyTypeBusById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTypeBus = action.payload;
      })
      .addCase(fetchCompanyTypeBusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createCompanyTypeBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanyTypeBus.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(createCompanyTypeBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateCompanyTypeBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyTypeBus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateCompanyTypeBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteCompanyTypeBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompanyTypeBus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteCompanyTypeBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedTypeBus } = companyTypeBusSlice.actions;
export default companyTypeBusSlice.reducer;
