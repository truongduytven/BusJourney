import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import type {
  MyTicketsResponse,
  TicketDetailResponse,
  TicketStatusFilter,
} from '../../types/myTicket';

// using apiClient baseURL

// Fetch user's tickets
export const fetchMyTickets = createAsyncThunk(
  'myTicket/fetchMyTickets',
  async (
    {
      status,
      page = 1,
      limit = 10,
    }: {
      status?: TicketStatusFilter;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<MyTicketsResponse>(`/tickets/my-tickets?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        success: false,
        message: error.message || 'Không thể tải danh sách vé',
      });
    }
  }
);

// Fetch ticket detail
export const fetchTicketDetail = createAsyncThunk(
  'myTicket/fetchTicketDetail',
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiClient.get<TicketDetailResponse>(`/tickets/${ticketId}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        success: false,
        message: error.message || 'Không thể tải thông tin vé',
      });
    }
  }
);
