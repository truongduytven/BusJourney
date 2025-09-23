import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";
import type { SearchTrips, TripSearchPayload } from "@/types/trip";

interface TripState {
  list: SearchTrips | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TripState = {
  list: null,
  status: "idle",
  error: null,
};

export const fetchTrips = createAsyncThunk<
  SearchTrips, // return type
  TripSearchPayload // arg type
>("trips/fetch", async (payload, { rejectWithValue }) => {
  try {
    const {
      pageNumber,
      pageSize,
      minPrice,
      maxPrice,
      sort,
      ...body
    } = payload;

    const res = await axios.post<SearchTrips>(
      `${import.meta.env.VITE_API_URL}/trips/search`,
      {
        ...body,
        departureDate: new Date(body.departureDate) < new Date() ? new Date().toISOString() : body.departureDate,
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

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải chuyến xe: " + state.error);
      });
  },
});

export default tripSlice.reducer;
