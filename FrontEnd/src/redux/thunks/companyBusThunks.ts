import { createAsyncThunk } from '@reduxjs/toolkit';
import { companyBusAPI } from '../../services/companyBusAPI';
import type { CreateBusRequest, UpdateBusRequest } from '../../types/bus';

export const fetchCompanyBuses = createAsyncThunk(
  'companyBus/fetchList',
  async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    typeBusId?: string;
  }) => {
    const response = await companyBusAPI.getList(params);
    return response;
  }
);

export const fetchCompanyBusById = createAsyncThunk(
  'companyBus/fetchById',
  async (id: string) => {
    const response = await companyBusAPI.getById(id);
    return response.data;
  }
);

export const createCompanyBus = createAsyncThunk(
  'companyBus/create',
  async (payload: { data: CreateBusRequest; images?: File[] }) => {
    const response = await companyBusAPI.create(payload);
    return response.data;
  }
);

export const updateCompanyBus = createAsyncThunk(
  'companyBus/update',
  async ({ id, data, images }: { id: string; data: UpdateBusRequest; images?: File[] }) => {
    const response = await companyBusAPI.update(id, { data, images });
    return response.data;
  }
);

export const deleteCompanyBus = createAsyncThunk(
  'companyBus/delete',
  async (id: string) => {
    await companyBusAPI.delete(id);
    return id;
  }
);
