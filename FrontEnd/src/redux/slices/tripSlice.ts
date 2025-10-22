import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { SearchTrips } from "@/types/trip";
import { fetchTrips } from "@/redux/thunks/tripThunks";

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
        action.payload.data.length === 0
          ? toast.error("Không tìm thấy chuyến xe phù hợp")
          : toast.success("Tải chuyến xe thành công");
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải chuyến xe: " + state.error);
      });
  },
});

export default tripSlice.reducer;
