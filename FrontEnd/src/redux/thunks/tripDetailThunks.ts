import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '@/lib/axios';
import type { 
  TripDetail, 
  TripDetailCoupons, 
  TripDetailPoints, 
  TripDetailRatings, 
  TripDetailPolicies, 
  TripDetailImages, 
  TripDetailExtensions 
} from "@/types/trip";

interface ResponseData<T> {
  message: string;
  data: T;
}

export const fetchTripDetail = createAsyncThunk<TripDetail, string>(
  "trips_details/fetch",
  async (tripId: string) => {
    const res = await apiClient.get<ResponseData<TripDetail>>(`/trips/${tripId}`);
    return res.data.data;
  }
);

export const fetchTripCoupons = createAsyncThunk<TripDetailCoupons, string>(
  "trips_details/fetchCoupons",
  async (tripId: string) => {
    const res = await apiClient.get<ResponseData<TripDetailCoupons>>(`/trips/${tripId}/coupons`);
    return res.data.data;
  }
);

export const fetchTripPoints = createAsyncThunk<TripDetailPoints, string>(
  "trips_details/fetchPoints",
  async (tripId: string) => {
    const res = await apiClient.get<ResponseData<TripDetailPoints>>(`/trips/${tripId}/points`);
    return res.data.data;
  }
);

export const fetchTripRatings = createAsyncThunk<
  TripDetailRatings, 
  { 
    tripId: string; 
    page?: number; 
    pageSize?: number; 
    filterType?: 'all' | 'withComment' | 'withImage';
    starRatings?: number[];
  }
>(
  "trips_details/fetchRatings",
  async ({ tripId, page = 1, pageSize = 5, filterType = 'all', starRatings = [] }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      filterType,
    });
    
    if (starRatings.length > 0) {
      params.append('starRatings', starRatings.join(','));
    }
    
    const res = await apiClient.get<ResponseData<TripDetailRatings>>(
      `/trips/${tripId}/ratings?${params.toString()}`
    );
    return res.data.data;
  }
);

export const fetchTripPolicies = createAsyncThunk<TripDetailPolicies, string>(
  "trips_details/fetchPolicies",
  async (tripId: string) => {
    const res = await apiClient.get<ResponseData<TripDetailPolicies>>(`/trips/${tripId}/policies`);
    return res.data.data;
  }
);

export const fetchTripImages = createAsyncThunk<TripDetailImages, string>(
  "trips_details/fetchImages",
  async (tripId: string) => {
    const res = await apiClient.get<ResponseData<TripDetailImages>>(`/trips/${tripId}/images`);
    return res.data.data;
  }
);

export const fetchTripExtensions = createAsyncThunk<TripDetailExtensions, string>(
  "trips_details/fetchExtensions",
  async (tripId: string) => {
    const res = await apiClient.get<ResponseData<TripDetailExtensions>>(`/trips/${tripId}/extensions`);
    return res.data.data;
  }
);
