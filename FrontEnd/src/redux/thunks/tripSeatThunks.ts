import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { ITripSeatResult } from "@/types/trip";

interface ResponseData {
  message: string;
  data: ITripSeatResult;
}

export const fetchTripSeat = createAsyncThunk<ITripSeatResult, string>(
  "trips_seats/fetch",
  async (tripId: string) => {
    const res = await axios.get<ResponseData>(
      `${import.meta.env.VITE_API_URL}/trips/seats/${tripId}`
    );
    return res.data.data;
  }
);
