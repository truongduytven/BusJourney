export interface Location {
  id: string;
  cityId: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  city?: {
    id: string;
    name: string;
  };
}

export interface LocationListPayload {
  isActive?: boolean;
  search?: string;
  cityId?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface LocationListResponse {
  locations: Location[];
  totalLocations: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}
