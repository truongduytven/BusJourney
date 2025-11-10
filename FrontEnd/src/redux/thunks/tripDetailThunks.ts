import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '@/lib/axios';
import type { TripDetail } from "@/types/trip";

interface ResponseData {
  message: string;
  data: TripDetail;
}

export const fetchTripDetail = createAsyncThunk<TripDetail, string>(
  "trips_details/fetch",
  async (tripId: string) => {
    const res = await apiClient.get<ResponseData>(`/trips/${tripId}`);
    return res.data.data;
  }
);
