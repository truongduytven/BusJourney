import type { TypeBus } from './typeBus';

export interface Bus {
  id: string;
  licensePlate: string;
  typeBusId: string;
  busCompanyId: string;
  type_buses?: TypeBus;
  bus_companies?: {
    id: string;
    name: string;
  };
  extensions: string[];
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BusListResponse {
  success: boolean;
  message: string;
  data: Bus[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface BusDetailResponse {
  success: boolean;
  message: string;
  data: Bus;
}

export interface CreateBusRequest {
  licensePlate: string;
  typeBusId: string;
  extensions?: string[];
  images?: string[];
}

export interface UpdateBusRequest {
  licensePlate?: string;
  typeBusId?: string;
  extensions?: string[];
  images?: string[];
}
