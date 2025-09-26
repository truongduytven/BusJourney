import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";
import type { TripDetail } from "@/types/trip";

interface tripDetailState {
  list: TripDetail[];
  listTripId: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: tripDetailState = {
  list: [],
  listTripId: [],
  status: "idle",
  error: null,
};

interface responseData {
  message: string;
  data: TripDetail;
}

export const fetchTripDetail = createAsyncThunk<TripDetail, string>(
  "trips_details/fetch",
  async (tripId: string) => {
    const res = await axios.get<responseData>(
      `${import.meta.env.VITE_API_URL}/trips/${tripId}`
    );
    return res.data.data;
  }
);

const tripDetailSlice = createSlice({
  name: "tripDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTripDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTripDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.listTripId.push(action.payload.tripId);
        state.list.push(action.payload);
      })
      .addCase(fetchTripDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải chi tiết chuyến đi: " + state.error);
      });
  },
});

export default tripDetailSlice.reducer;
