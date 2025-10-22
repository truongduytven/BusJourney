import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { TripDetail } from "@/types/trip";

interface ResponseData {
  message: string;
  data: TripDetail;
}

export const fetchTripDetail = createAsyncThunk<TripDetail, string>(
  "trips_details/fetch",
  async (tripId: string) => {
    const res = await axios.get<ResponseData>(
      `${import.meta.env.VITE_API_URL}/trips/${tripId}`
    );
    return res.data.data;
  }
);
