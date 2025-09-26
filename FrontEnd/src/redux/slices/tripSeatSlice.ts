import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";
import type { ITripSeatResult } from "@/types/trip";

interface tripSeatState {
  listSeats: ITripSeatResult[];
  listSeatsTripId: string[];
  statusSeats: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: tripSeatState = {
  listSeats: [],
  listSeatsTripId: [],
  statusSeats: "idle",
  error: null,
};

interface responseData {
  message: string;
  data: ITripSeatResult;
}

export const fetchTripSeat = createAsyncThunk<ITripSeatResult, string>(
  "trips_seats/fetch",
  async (tripId: string) => {
    const res = await axios.get<responseData>(
      `${import.meta.env.VITE_API_URL}/trips/seats/${tripId}`
    );
    return res.data.data;
  }
);

const tripSeatSlice = createSlice({
  name: "tripSeats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTripSeat.pending, (state) => {
        state.statusSeats = "loading";
      })
      .addCase(fetchTripSeat.fulfilled, (state, action) => {
        state.statusSeats = "succeeded";
        state.listSeatsTripId.push(action.payload.tripId);
        state.listSeats.push(action.payload);
      })
      .addCase(fetchTripSeat.rejected, (state, action) => {
        state.statusSeats = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải chi tiết ghế ngồi: " + state.error);
      });
  },
});

export default tripSeatSlice.reducer;
