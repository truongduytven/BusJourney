import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '@/lib/axios';
import type { SearchTrips, TripSearchPayload } from "@/types/trip";

export const fetchTrips = createAsyncThunk<
  SearchTrips, // return type
  TripSearchPayload // arg type
>("trips/fetch", async (payload, { rejectWithValue }) => {
  try {
    const { pageNumber, pageSize, minPrice, maxPrice, sort, ...body } = payload;

    const res = await apiClient.post<SearchTrips>(`/trips/search`,
      {
        ...body,
        departureDate:
          new Date(body.departureDate) < new Date()
            ? new Date().toISOString()
            : body.departureDate,
      },
      {
        params: {
          pageNumber,
          pageSize,
          minPrice,
          maxPrice,
          sort,
        },
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Fetch trips failed");
  }
});
