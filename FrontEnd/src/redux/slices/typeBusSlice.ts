import { createSlice } from "@reduxjs/toolkit";
import type { TypeBus } from "@/types/typeBus";
import { toast } from "sonner";
import { fetchTypeBuses } from "@/redux/thunks/typeBusThunks";

interface TypeBusState {
  list: TypeBus[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TypeBusState = {
  list: [],
  status: "idle",
  error: null,
};

const typeBusSlice = createSlice({
  name: "typeBuses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypeBuses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTypeBuses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTypeBuses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải danh sách loại xe: " + state.error);
      });
  },
});

export default typeBusSlice.reducer;
