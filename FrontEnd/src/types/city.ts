export interface City {
  id: string;
  name: string;
  isActive: boolean;
}

export interface CityListPayload {
  search?: string;
  isActive?: boolean;
  pageSize: number;
  pageNumber: number;
}

export interface CityListResponse {
  cities: City[];
  totalPage: number;
  currentPage: number;
  pageSize: number;
  totalCities: number;
}

export interface CreateCityPayload {
  name: string;
  isActive?: boolean;
}

export interface UpdateCityPayload {
  name?: string;
  isActive?: boolean;
}
