import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { City } from "@/types/city";
import { toast } from "sonner";

interface SelectedTripState {
  list: City[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SelectedTripState = {
  list: [],
  status: "idle",
  error: null,
};

interface responseData {
    message: string;
    data: City[];
}

export const fetchCities = createAsyncThunk<City[]>(
  "cities/fetch",
  async () => {
    const res = await axios.get<responseData>(`${import.meta.env.VITE_API_URL}/cities`);
    return res.data.data;
  }
);

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
