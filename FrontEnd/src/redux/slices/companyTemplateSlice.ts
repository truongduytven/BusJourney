import { createSlice } from '@reduxjs/toolkit';
import type { Template } from '@/types/companyTemplate';
import { fetchCompanyTemplates, createCompanyTemplate, updateCompanyTemplate, toggleCompanyTemplateActive, bulkToggleCompanyTemplateActive } from '../thunks/companyTemplateThunks';

interface CompanyTemplateState {
  templates: Template[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CompanyTemplateState = {
  templates: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
};

const companyTemplateSlice = createSlice({
  name: 'companyTemplate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompanyTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      })
      .addCase(createCompanyTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanyTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.unshift(action.payload.data);
      })
      .addCase(createCompanyTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create template';
      })
      .addCase(updateCompanyTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex(template => template.id === action.payload.data.id);
        if (index !== -1) {
          state.templates[index] = action.payload.data;
        }
      })
      .addCase(updateCompanyTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update template';
      })
      .addCase(toggleCompanyTemplateActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCompanyTemplateActive.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index].isActive = action.payload.isActive;
        }
      })
      .addCase(toggleCompanyTemplateActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to toggle template';
      })
      .addCase(bulkToggleCompanyTemplateActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkToggleCompanyTemplateActive.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.ids.forEach(id => {
          const index = state.templates.findIndex(t => t.id === id);
          if (index !== -1) {
            state.templates[index].isActive = action.payload.isActive;
          }
        });
      })
      .addCase(bulkToggleCompanyTemplateActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to bulk toggle templates';
      });
  },
});

export default companyTemplateSlice.reducer;
