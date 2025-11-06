import { createSlice } from "@reduxjs/toolkit";
import type { City, CityListResponse } from "@/types/city";
import { toast } from "sonner";
import { fetchCities, fetchCityList, createCity, updateCity, deleteCity } from "@/redux/thunks/cityThunks";

interface CityState {
  list: City[];
  cityList: CityListResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CityState = {
  list: [],
  cityList: {
    cities: [],
    totalPage: 0,
    currentPage: 1,
    pageSize: 10,
    totalCities: 0,
  },
  status: "idle",
  error: null,
};

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all cities (original)
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
      })
      // Fetch city list with pagination
      .addCase(fetchCityList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCityList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cityList = action.payload;
      })
      .addCase(fetchCityList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải danh sách thành phố");
      })
      // Create city
      .addCase(createCity.fulfilled, () => {
        toast.success("Tạo thành phố thành công");
      })
      .addCase(createCity.rejected, (state, action) => {
        toast.error(action.payload as string || "Lỗi khi tạo thành phố");
      })
      // Update city
      .addCase(updateCity.fulfilled, () => {
        toast.success("Cập nhật thành phố thành công");
      })
      .addCase(updateCity.rejected, (state, action) => {
        toast.error(action.payload as string || "Lỗi khi cập nhật thành phố");
      })
      // Delete city
      .addCase(deleteCity.fulfilled, () => {
        toast.success("Xóa thành phố thành công");
      })
      .addCase(deleteCity.rejected, (state, action) => {
        toast.error(action.payload as string || "Lỗi khi xóa thành phố");
      });
  },
});

export default citySlice.reducer;
