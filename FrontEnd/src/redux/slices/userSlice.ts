import type { UserResponse } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "../thunks/userThunks";
import { toast } from "sonner";

interface ListUser {
  list: UserResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ListUser = {
  list: {
    users: [],
    totalPage: 0,
    currentPage: 0,
    pageSize: 0,
    totalUsers: 0,
  },
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        toast.success("Tải danh sách người dùng thành công");
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải danh sách người dùng: " + state.error);
      });
  },
});

export default userSlice.reducer;
