import type { UserResponse, Role } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, fetchRoles, createUser, updateUser, bulkToggleActive } from "../thunks/userThunks";
import { toast } from "sonner";

interface ListUser {
  list: UserResponse;
  roles: Role[];
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
  roles: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải danh sách người dùng: " + state.error);
      })
      // Fetch Roles
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        toast.error("Lỗi khi tải danh sách vai trò");
      })
      // Create User
      .addCase(createUser.fulfilled, (state) => {
        toast.success("Tạo người dùng thành công");
      })
      .addCase(createUser.rejected, (state, action) => {
        const error = action.payload as any;
        toast.error(error?.message || "Lỗi khi tạo người dùng");
      })
      // Update User
      .addCase(updateUser.fulfilled, (state) => {
        toast.success("Cập nhật người dùng thành công");
      })
      .addCase(updateUser.rejected, (state, action) => {
        const error = action.payload as any;
        toast.error(error?.message || "Lỗi khi cập nhật người dùng");
      })
      // Bulk Toggle Active
      .addCase(bulkToggleActive.fulfilled, (state, action) => {
        toast.success(`Đã cập nhật ${action.payload.updatedCount} tài khoản`);
      })
      .addCase(bulkToggleActive.rejected, (state, action) => {
        const error = action.payload as any;
        toast.error(error?.message || "Lỗi khi cập nhật tài khoản");
      });
  },
});

export default userSlice.reducer;
