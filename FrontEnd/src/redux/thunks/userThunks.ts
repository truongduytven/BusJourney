import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { UserPayload, UserResponse } from "@/types/user";

export interface ResponseData {
  message: string;
  data: UserResponse;
}

export const fetchUsers = createAsyncThunk<
  UserResponse,
  UserPayload
>(
  "users/fetch",
  async (payload: UserPayload, { rejectWithValue }) => {
    try {
      const { roleName, pageSize, pageNumber } = payload;
      const token = localStorage.getItem("authToken");
      
      if(!token) throw new Error("No token found");
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get<ResponseData>(`${import.meta.env.VITE_API_URL}/users/${roleName}`, {
        params: { pageSize, pageNumber },
      });
      console.log(response)
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Fetch trips failed");
    }
  }
);
