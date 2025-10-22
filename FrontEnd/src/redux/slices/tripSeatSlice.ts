import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { ITripSeatResult } from "@/types/trip";
import { fetchTripSeat } from "@/redux/thunks/tripSeatThunks";

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
