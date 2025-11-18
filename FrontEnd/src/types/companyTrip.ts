export interface Trip {
  id: string;
  busRoutesId?: string;
  templateId?: string;
  busId: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: boolean;
  totalSeats?: number;
  bookedSeats?: number;
  availableSeats?: number;
  busRoute?: BusRoute;
  buses?: Bus;
  template?: Template;
}

export interface BusRoute {
  id: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  route?: Route;
}

export interface Route {
  id: string;
  name: string;
  distance: number;
  startLocationId: string;
  endLocationId: string;
  startLocation?: Location;
  endLocation?: Location;
}

export interface Location {
  id: string;
  name: string;
}

export interface Bus {
  id: string;
  licensePlate: string;
  typeBusId: string;
  companyId: string;
  type_buses?: TypeBus;
}

export interface TypeBus {
  id: string;
  name: string;
  totalSeats: number;
}

export interface Template {
  id: string;
  name: string;
  companyId: string;
}

export interface CreateTripRequest {
  busRoutesId?: string;
  templateId?: string;
  busId: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status?: boolean;
}

export interface CreateBulkTripRequest {
  dates: string[];
  busRoutesId?: string;
  templateId?: string;
  busId: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status?: boolean;
}

export interface TripListResponse {
  success: boolean;
  message: string;
  data: Trip[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface TripResponse {
  success: boolean;
  message: string;
  data: Trip;
}
