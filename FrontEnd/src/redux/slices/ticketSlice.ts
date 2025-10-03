import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export interface TicketLookupRequest {
  email: string;
  phone: string;
  ticketCode: string;
}

export interface TicketWithRelations {
  ticket: TicketSearch;
  trip: TicketTrip;
  passenger: TicketPassenger;
  order: TicketOrder;
  transaction: TicketTransaction | null;
  pickUpPoint: Point | null;
  dropOffPoint: Point | null;
}

export interface TicketSearch {
  id: string;
  ticketCode: string;
  seatCode: string;
  status: string;
  qrCode: string;
  checkedDate: string | null;
  checkedBy: string | null;
}

export interface TicketTrip {
  id: string;
  departureTime: Date;
  arrivalTime: Date;
  price: string;
  status: string;
  route: {
    id: string;
    startLocation: Location;
    endLocation: Location;
  }
  bus: {
    id: string;
    licensePlate: string;
    images: string[];
    extension: string[];
    company: Company;
    typeBus: typeBus;
  }
}

export interface TicketPassenger {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
}

export interface TicketOrder {
  id: string;
  originAmount: string;
  finalAmount: string;
  status: string;
  createdAt: Date;
  coupon: Coupon | null;
}

interface Coupon {
  id: string;
  description: string;
  discountType: string;
  discountValue: string;
}

export interface TicketTransaction {
  id: string;
  amount: string;
  paymentMethod: string;
  status: string;
  createdAt: Date;
}

export interface Point {
  id: string;
  type: string;
  time: Date;
  locationName: string;
}

interface Company {
  id: string
  name: string
  phone: string
  address: string
}

interface typeBus {
  id: string;
  name: string;
  totalSeats: number;
  isFloor: false;
}

interface Location {
  id: string;
  name: string;
  cityName: string;
}

export interface TicketLookupResponse {
  success: boolean;
  message: string;
  data?: TicketWithRelations;
  error?: string;
}

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

// Async thunk for ticket lookup
export const lookupTicket = createAsyncThunk<
  TicketLookupResponse,
  TicketLookupRequest,
  { rejectValue: string }
>(
  'ticket/lookup',
  async (lookupData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lookupData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Tra cứu vé thất bại');
    }
  }
);

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