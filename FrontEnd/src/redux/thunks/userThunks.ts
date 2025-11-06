import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { UserPayload, UserResponse, Role, UserDataResponse } from "@/types/user";

export interface ResponseData {
  message: string;
  data: UserResponse;
}

export interface RoleResponseData {
  message: string;
  data: Role[];
}

export interface UserResponseData {
  message: string;
  data: UserDataResponse;
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

export const fetchRoles = createAsyncThunk<Role[]>(
  "users/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if(!token) throw new Error("No token found");
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const response = await axios.get<RoleResponseData>(`${import.meta.env.VITE_API_URL}/roles`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Fetch roles failed");
    }
  }
);

export const createUser = createAsyncThunk<UserDataResponse, FormData>(
  "users/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if(!token) throw new Error("No token found");
      
      const response = await axios.post<UserResponseData>(
        `${import.meta.env.VITE_API_URL}/users`,
        formData,
        { 
          headers: {
            "Authorization": `Bearer ${token}`,
            // Don't set Content-Type - browser will set it with boundary for FormData
          }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create user failed");
    }
  }
);

export const getUserById = createAsyncThunk<UserDataResponse, string>(
  "users/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if(!token) throw new Error("No token found");
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const response = await axios.get<UserResponseData>(
        `${import.meta.env.VITE_API_URL}/users/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Fetch user failed");
    }
  }
);

export const updateUser = createAsyncThunk<
  UserDataResponse,
  { id: string; data: FormData }
>(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if(!token) throw new Error("No token found");
      
      const response = await axios.put<UserResponseData>(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        data,
        { 
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Update user failed");
    }
  }
);

export const bulkToggleActive = createAsyncThunk<
  { updatedCount: number },
  { userIds: string[]; isActive: boolean }
>(
  "users/bulkToggleActive",
  async ({ userIds, isActive }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      if(!token) throw new Error("No token found");
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const response = await axios.put<{ message: string; data: { updatedCount: number } }>(
        `${import.meta.env.VITE_API_URL}/users/bulk-toggle-active`,
        { userIds, isActive }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Bulk toggle active failed");
    }
  }
);
