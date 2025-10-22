import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { TypeBus } from "@/types/typeBus";

interface ResponseData {
  message: string;
  data: TypeBus[];
}

export const fetchTypeBuses = createAsyncThunk<TypeBus[]>(
  "typeBuses/fetch",
  async () => {
    const res = await axios.get<ResponseData>(`${import.meta.env.VITE_API_URL}/types-bus`);
    return res.data.data;
  }
);
