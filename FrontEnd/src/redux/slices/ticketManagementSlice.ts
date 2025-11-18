import { createSlice } from '@reduxjs/toolkit';
import type { Ticket } from '@/types/ticket';
import {
  fetchAdminTickets,
  fetchCompanyTickets,
  updateAdminTicket,
  updateCompanyTicket,
  deleteAdminTicket,
  deleteCompanyTicket,
  toggleAdminTicketStatus,
  toggleCompanyTicketStatus,
  checkInTicket,
} from '../thunks/ticketThunks';

interface TicketManagementState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalTickets: number;
    totalPage: number;
  };
}

const initialState: TicketManagementState = {
  tickets: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalTickets: 0,
    totalPage: 0,
  },
};

const ticketManagementSlice = createSlice({
  name: 'ticketManagement',
  initialState,
  reducers: {
    resetTicketManagementState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch admin tickets
    builder.addCase(fetchAdminTickets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminTickets.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets = action.payload.tickets;
      state.pagination = {
        currentPage: action.payload.currentPage,
        pageSize: action.payload.pageSize,
        totalTickets: action.payload.totalTickets,
        totalPage: action.payload.totalPage,
      };
    });
    builder.addCase(fetchAdminTickets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch tickets';
    });

    // Fetch company tickets
    builder.addCase(fetchCompanyTickets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCompanyTickets.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets = action.payload.tickets;
      state.pagination = {
        currentPage: action.payload.currentPage,
        pageSize: action.payload.pageSize,
        totalTickets: action.payload.totalTickets,
        totalPage: action.payload.totalPage,
      };
    });
    builder.addCase(fetchCompanyTickets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch tickets';
    });

    // Update admin ticket
    builder.addCase(updateAdminTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAdminTicket.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateAdminTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update ticket';
    });

    // Update company ticket
    builder.addCase(updateCompanyTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCompanyTicket.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateCompanyTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update ticket';
    });

    // Delete admin ticket
    builder.addCase(deleteAdminTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAdminTicket.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteAdminTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete ticket';
    });

    // Delete company ticket
    builder.addCase(deleteCompanyTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCompanyTicket.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteCompanyTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete ticket';
    });

    // Toggle admin ticket status
    builder.addCase(toggleAdminTicketStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(toggleAdminTicketStatus.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(toggleAdminTicketStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to toggle ticket status';
    });

    // Toggle company ticket status
    builder.addCase(toggleCompanyTicketStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(toggleCompanyTicketStatus.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(toggleCompanyTicketStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to toggle ticket status';
    });

    // Check-in ticket
    builder.addCase(checkInTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkInTicket.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(checkInTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to check in ticket';
    });
  },
});

export const { resetTicketManagementState } = ticketManagementSlice.actions;
export default ticketManagementSlice.reducer;
