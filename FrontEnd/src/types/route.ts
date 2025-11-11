export interface Route {
  id: string;
  startLocationId: string;
  endLocationId: string;
  distanceKm: number;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
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
}

export interface RouteListResponse {
  success: boolean;
  message: string;
  data: Route[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
