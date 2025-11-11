export interface BusRoute {
  id: string;
  routeId: string;
  busCompanyId: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  route?: {
    id: string;
    startLocationId: string;
    endLocationId: string;
    distanceKm: number;
    status?: string;
    startLocation?: {
      id: string;
      name: string;
      cityId?: string;
    };
    endLocation?: {
      id: string;
      name: string;
      cityId?: string;
    };
  };
  company?: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
}

export interface BusRouteListResponse {
  success: boolean;
  message: string;
  data: BusRoute[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApprovedRoute {
  id: string;
  startLocationId: string;
  endLocationId: string;
  distanceKm: number;
  status: string;
  startLocation?: {
    id: string;
    name: string;
  };
  endLocation?: {
    id: string;
    name: string;
  };
}

export interface ApprovedRoutesResponse {
  success: boolean;
  message: string;
  data: ApprovedRoute[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
