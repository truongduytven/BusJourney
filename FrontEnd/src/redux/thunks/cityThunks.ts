import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { City } from "@/types/city";

interface ResponseData {
  message: string;
  data: City[];
}

export const fetchCities = createAsyncThunk<City[]>(
  "cities/fetch",
  async () => {
    const res = await axios.get<ResponseData>(`${import.meta.env.VITE_API_URL}/cities`);
    return res.data.data;
  }
);
