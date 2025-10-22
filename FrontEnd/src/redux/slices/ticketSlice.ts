import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  lookupTicket,
  type TicketWithRelations,
} from '@/redux/thunks/ticketThunks';

export interface TicketState {
  loading: boolean;
  error: string | null;
  ticketInfo: TicketWithRelations | null;
  lookupHistory: TicketWithRelations[];
}

const initialState: TicketState = {
  loading: false,
  error: null,
  ticketInfo: null,
  lookupHistory: [],
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    clearTicketInfo: (state) => {
      state.ticketInfo = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addToHistory: (state, action: PayloadAction<TicketWithRelations>) => {
      // Add to history if not already present
      const exists = state.lookupHistory.some(
        (ticket) => ticket.ticket.id === action.payload.ticket.id
      );
      if (!exists) {
        state.lookupHistory.unshift(action.payload);
        // Keep only last 10 lookups
        if (state.lookupHistory.length > 10) {
          state.lookupHistory = state.lookupHistory.slice(0, 10);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Ticket lookup
      .addCase(lookupTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(lookupTicket.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.ticketInfo = action.payload.data;
          // Add to history
          const exists = state.lookupHistory.some(
            (ticket) => ticket.ticket.id === action.payload.data!.ticket.id
          );
          if (!exists) {
            state.lookupHistory.unshift(action.payload.data);
            // Keep only last 10 lookups
            if (state.lookupHistory.length > 10) {
              state.lookupHistory = state.lookupHistory.slice(0, 10);
            }
          }
        } else {
          state.error = action.payload.message || 'Không tìm thấy vé';
        }
      })
      .addCase(lookupTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Tra cứu vé thất bại';
      });
  },
});

export const { clearTicketInfo, clearError, addToHistory } = ticketSlice.actions;
export default ticketSlice.reducer;