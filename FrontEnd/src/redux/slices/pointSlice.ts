import { createSlice } from '@reduxjs/toolkit';
import type { PointListResponse } from '@/types/point';
import {
  fetchPointList,
  createPoint,
  updatePoint,
  deletePoint,
} from '@/redux/thunks/pointThunks';

interface PointState {
  pointList: PointListResponse;
  loading: boolean;
  error: string | null;
}

const initialState: PointState = {
  pointList: {
    points: [],
    totalPoints: 0,
    totalPage: 0,
    currentPage: 1,
    pageSize: 10,
  },
  loading: false,
  error: null,
};

const pointSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    clearPointError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch point list
    builder
      .addCase(fetchPointList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointList.fulfilled, (state, action) => {
        state.loading = false;
        state.pointList = action.payload;
      })
      .addCase(fetchPointList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create point
    builder
      .addCase(createPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoint.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update point
    builder
      .addCase(updatePoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePoint.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete point
    builder
      .addCase(deletePoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePoint.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPointError } = pointSlice.actions;
export default pointSlice.reducer;
