import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type {
  MyTicketsResponse,
  TicketDetailResponse,
  TicketStatusFilter,
} from '../../types/myTicket';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

      const response = await axios.get<MyTicketsResponse>(
        `${API_URL}/tickets/my-tickets?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      const response = await axios.get<TicketDetailResponse>(
        `${API_URL}/tickets/${ticketId}/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
