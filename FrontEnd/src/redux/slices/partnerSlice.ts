import { createSlice } from '@reduxjs/toolkit';
import type { PartnerListResponse, PartnerStats } from '@/types/partner';
import {
  registerPartner,
  fetchPartnerList,
  updatePartnerStatus,
  deletePartner,
  fetchPartnerStats,
} from '@/redux/thunks/partnerThunks';

interface PartnerState {
  partnerList: PartnerListResponse;
  stats: PartnerStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: PartnerState = {
  partnerList: {
    partners: [],
    totalPartners: 0,
    totalPage: 0,
    currentPage: 1,
    pageSize: 10,
  },
  stats: null,
  loading: false,
  error: null,
};

const partnerSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    clearPartnerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register partner (public)
    builder
      .addCase(registerPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPartner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch partner list (admin)
    builder
      .addCase(fetchPartnerList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerList.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerList = action.payload;
      })
      .addCase(fetchPartnerList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update partner status (admin)
    builder
      .addCase(updatePartnerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePartnerStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePartnerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete partner (admin)
    builder
      .addCase(deletePartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePartner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch partner stats (admin)
    builder
      .addCase(fetchPartnerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPartnerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPartnerError } = partnerSlice.actions;
export default partnerSlice.reducer;
