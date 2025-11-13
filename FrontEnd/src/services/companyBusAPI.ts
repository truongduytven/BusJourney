import axiosInstance from '../lib/axios';
import type {
  BusListResponse,
  BusDetailResponse,
  CreateBusRequest,
  UpdateBusRequest
} from '../types/bus';

export const companyBusAPI = {
  getList: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    typeBusId?: string;
  }): Promise<BusListResponse> => {
    const response = await axiosInstance.get('/buses/company', { params });
    return response.data;
  },

  getById: async (id: string): Promise<BusDetailResponse> => {
    const response = await axiosInstance.get(`/buses/company/${id}`);
    return response.data;
  },

  create: async (data: {
    data: CreateBusRequest;
    images?: File[];
  }): Promise<BusDetailResponse> => {
    const formData = new FormData();
    formData.append('licensePlate', data.data.licensePlate);
    formData.append('typeBusId', data.data.typeBusId);
    
    if (data.data.extensions && data.data.extensions.length > 0) {
      formData.append('extensions', JSON.stringify(data.data.extensions));
    }
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await axiosInstance.post('/buses/company', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (
    id: string,
    data: {
      data: UpdateBusRequest;
      images?: File[];
    }
  ): Promise<BusDetailResponse> => {
    const formData = new FormData();
    
    if (data.data.licensePlate) {
      formData.append('licensePlate', data.data.licensePlate);
    }
    if (data.data.typeBusId) {
      formData.append('typeBusId', data.data.typeBusId);
    }
    if (data.data.extensions) {
      formData.append('extensions', JSON.stringify(data.data.extensions));
    }
    if (data.data.images) {
      formData.append('existingImages', JSON.stringify(data.data.images));
    }
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await axiosInstance.put(`/buses/company/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(`/buses/company/${id}`);
    return response.data;
  }
};
