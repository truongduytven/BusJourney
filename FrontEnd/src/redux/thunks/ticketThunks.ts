import { createAsyncThunk } from '@reduxjs/toolkit';

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
    typeBus: TypeBus;
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

interface TypeBus {
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
