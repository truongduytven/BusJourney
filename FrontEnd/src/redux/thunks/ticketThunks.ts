import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import type { TicketListResponse, TicketFilters, UpdateTicketRequest, Ticket } from '@/types/ticket';

// Types for ticket lookup (existing)
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
      const response = await apiClient.post('/tickets/lookup', lookupData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || (error instanceof Error ? error.message : 'Tra cứu vé thất bại'));
    }
  }
);

// Admin: Fetch ticket list
export const fetchAdminTickets = createAsyncThunk<
  TicketListResponse,
  TicketFilters & { pageSize?: number; pageNumber?: number },
  { rejectValue: string }
>('tickets/fetchAdminList', async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.tripId) params.append('tripId', filters.tripId);
    if (filters.orderId) params.append('orderId', filters.orderId);
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString());

    const response = await apiClient.get(`/admin/tickets/list?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
  }
});

// Company: Fetch ticket list
export const fetchCompanyTickets = createAsyncThunk<
  TicketListResponse,
  TicketFilters & { pageSize?: number; pageNumber?: number },
  { rejectValue: string }
>('tickets/fetchCompanyList', async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.tripId) params.append('tripId', filters.tripId);
    if (filters.orderId) params.append('orderId', filters.orderId);
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString());

    const response = await apiClient.get(`/company-tickets/company/list?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
  }
});

// Admin: Update ticket
export const updateAdminTicket = createAsyncThunk<
  void,
  { id: string; data: UpdateTicketRequest },
  { rejectValue: string }
>('tickets/updateAdmin', async ({ id, data }, { rejectWithValue }) => {
  try {
    await apiClient.put(`/admin/tickets/${id}`, data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update ticket');
  }
});

// Company: Update ticket
export const updateCompanyTicket = createAsyncThunk<
  void,
  { id: string; data: UpdateTicketRequest },
  { rejectValue: string }
>('tickets/updateCompany', async ({ id, data }, { rejectWithValue }) => {
  try {
    await apiClient.put(`/company-tickets/company/${id}`, data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update ticket');
  }
});

// Admin: Delete ticket
export const deleteAdminTicket = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('tickets/deleteAdmin', async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/admin/tickets/${id}`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete ticket');
  }
});

// Company: Delete ticket
export const deleteCompanyTicket = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('tickets/deleteCompany', async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/company-tickets/company/${id}`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete ticket');
  }
});

// Admin: Toggle ticket status
export const toggleAdminTicketStatus = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('tickets/toggleStatusAdmin', async (id, { rejectWithValue }) => {
  try {
    await apiClient.patch(`/admin/tickets/${id}/toggle-status`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to toggle ticket status');
  }
});

// Company: Toggle ticket status
export const toggleCompanyTicketStatus = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('tickets/toggleStatusCompany', async (id, { rejectWithValue }) => {
  try {
    await apiClient.patch(`/company-tickets/company/${id}/toggle-status`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to toggle ticket status');
  }
});

// Company: Check-in ticket
export const checkInTicket = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('tickets/checkIn', async (id, { rejectWithValue }) => {
  try {
    await apiClient.post(`/company-tickets/company/${id}/check-in`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to check in ticket');
  }
});
