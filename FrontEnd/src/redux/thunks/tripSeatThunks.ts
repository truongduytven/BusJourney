import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '@/lib/axios';
import type { ITripSeatResult } from "@/types/trip";

interface ResponseData {
  message: string;
  data: ITripSeatResult;
}

export const fetchTripSeat = createAsyncThunk<ITripSeatResult, string>(
  "trips_seats/fetch",
  async (tripId: string) => {
    const res = await apiClient.get<ResponseData>(`/trips/seats/${tripId}`);
    return res.data.data;
  }
);
