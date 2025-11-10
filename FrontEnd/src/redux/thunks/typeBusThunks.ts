import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '@/lib/axios';
import type { TypeBus } from "@/types/typeBus";

interface ResponseData {
  message: string;
  data: TypeBus[];
}

export const fetchTypeBuses = createAsyncThunk<TypeBus[]>(
  "typeBuses/fetch",
  async () => {
    const res = await apiClient.get<ResponseData>(`/types-bus`);
    return res.data.data;
  }
);
