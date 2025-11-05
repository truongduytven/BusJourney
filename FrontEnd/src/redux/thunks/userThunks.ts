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
      const { roleName, type, isVerified, isActive, search, pageSize, pageNumber } = payload;
      const token = localStorage.getItem("authToken");
      
      if(!token) throw new Error("No token found");
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Build params object, only include values if they're provided
      const params: any = { pageSize, pageNumber };
      if (roleName) params.roleName = roleName;
      if (type) params.type = type;
      if (isVerified !== undefined) params.isVerified = isVerified;
      if (isActive !== undefined) params.isActive = isActive;
      if (search) params.search = search;
      
      const response = await axios.get<ResponseData>(`${import.meta.env.VITE_API_URL}/users`, {
        params,
      });
      console.log(response);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Fetch users failed");
    }
  }
);
