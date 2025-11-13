import { createSlice } from "@reduxjs/toolkit";
import type { TypeBus } from "@/types/typeBus";
import { 
  fetchTypeBuses, 
  fetchTypeBusById, 
  createTypeBus, 
  updateTypeBus, 
  deleteTypeBus,
  bulkUpdateTypeBuses
} from "@/redux/thunks/typeBusThunks";

interface TypeBusState {
  data: TypeBus[];
  currentTypeBus: TypeBus | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: TypeBusState = {
  data: [],
  currentTypeBus: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  }
};

const typeBusSlice = createSlice({
  name: "typeBuses",
  initialState,
  reducers: {
    clearCurrentTypeBus: (state) => {
      state.currentTypeBus = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchTypeBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeBuses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTypeBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải danh sách loại xe';
      })
      
      // Fetch by ID
      .addCase(fetchTypeBusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeBusById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTypeBus = action.payload;
      })
      .addCase(fetchTypeBusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải thông tin loại xe';
      })
      
      // Create
      .addCase(createTypeBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTypeBus.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(createTypeBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update
      .addCase(updateTypeBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTypeBus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateTypeBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete
      .addCase(deleteTypeBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTypeBus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(item => item.id !== action.payload);
      })
      .addCase(deleteTypeBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Bulk update
      .addCase(bulkUpdateTypeBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateTypeBuses.fulfilled, (state, action) => {
        state.loading = false;
        const { ids, isFloors } = action.payload;
        state.data = state.data.map(item => 
          ids.includes(item.id) ? { ...item, isFloors } : item
        );
      })
      .addCase(bulkUpdateTypeBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTypeBus } = typeBusSlice.actions;
export default typeBusSlice.reducer;
