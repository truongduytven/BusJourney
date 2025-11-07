import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MyTicketState, TicketStatusFilter } from '../../types/myTicket';
import { fetchMyTickets, fetchTicketDetail } from '../thunks/myTicketThunks';

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

const initialState: MyTicketState = {
  tickets: [],
  currentTicket: null,
  status: 'all',
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
  cache: {},
  detailCache: {},
  lastFetch: {
    status: null,
    page: null,
    timestamp: 0,
  },
};

const myTicketSlice = createSlice({
  name: 'myTicket',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<TicketStatusFilter>) => {
      state.status = action.payload;
      state.pagination.page = 1; // Reset to first page when status changes
      
      // Load from cache if available
      const cachedData = state.cache[action.payload]?.[1];
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        state.tickets = cachedData.tickets;
        state.pagination = cachedData.pagination;
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      const newPage = action.payload;
      state.pagination.page = newPage;
      
      // Load from cache if available
      const cachedData = state.cache[state.status]?.[newPage];
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        state.tickets = cachedData.tickets;
        state.pagination = cachedData.pagination;
      }
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCache: (state) => {
      state.cache = {};
      state.detailCache = {};
    },
  },
  extraReducers: (builder) => {
    // Fetch my tickets
    builder
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        const { tickets, pagination } = action.payload.data;
        state.tickets = tickets;
        state.pagination = pagination;
        
        // Cache the data
        if (!state.cache[state.status]) {
          state.cache[state.status] = {};
        }
        state.cache[state.status]![pagination.page] = {
          tickets,
          pagination,
          timestamp: Date.now(),
        };
        
        // Update last fetch info
        state.lastFetch = {
          status: state.status,
          page: pagination.page,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || 'Không thể tải danh sách vé';
      });

    // Fetch ticket detail
    builder
      .addCase(fetchTicketDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketDetail.fulfilled, (state, action) => {
        state.loading = false;
        const ticketData = action.payload.data;
        state.currentTicket = ticketData;
        
        // Cache the detail
        state.detailCache[ticketData.ticketId] = {
          data: ticketData,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchTicketDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || 'Không thể tải thông tin vé';
      });
  },
});

export const { setStatus, setPage, clearCurrentTicket, clearError, clearCache } =
  myTicketSlice.actions;

export default myTicketSlice.reducer;
