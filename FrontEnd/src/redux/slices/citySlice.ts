import { createSlice } from "@reduxjs/toolkit";
import type { City } from "@/types/city";
import { toast } from "sonner";
import { fetchCities } from "@/redux/thunks/cityThunks";

interface CityState {
  list: City[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CityState = {
  list: [],
  status: "idle",
  error: null,
};

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải danh sách thành phố: " + state.error);
      });
  },
});

export default citySlice.reducer;
