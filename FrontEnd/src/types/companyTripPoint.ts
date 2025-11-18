export interface TripPoint {
  id: string;
  tripId: string;
  pointId: string;
  time: string;
  isActive: boolean;
  trip?: Trip;
  point?: Point;
}

export interface Trip {
  id: string;
  busRoutesId?: string;
  templateId?: string;
  busId: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: boolean;
  busRoute?: BusRoute;
  template?: Template;
  buses?: Bus;
}

export interface BusRoute {
  id: string;
  routeId: string;
  route?: Route;
}

export interface Route {
  id: string;
  name: string;
  startLocation?: Location;
  endLocation?: Location;
}

export interface Location {
  id: string;
  name: string;
}

export interface Template {
  id: string;
  name: string;
}

export interface Bus {
  id: string;
  licensePlate: string;
  typeBusId: string;
  companyId: string;
}

export interface Point {
  id: string;
  type: string;
  locationName: string;
  isActive: boolean;
}

export interface CreateTripPointRequest {
  tripId: string;
  pointId?: string;
  pointData?: {
    type: string;
    locationName: string;
  };
  time: string;
  isActive?: boolean;
}

export interface UpdateTripPointRequest {
  tripId?: string;
  pointId?: string;
  time?: string;
  isActive?: boolean;
}

export interface TripPointListResponse {
  success: boolean;
  message: string;
  data: TripPoint[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface TripPointResponse {
  success: boolean;
  message: string;
  data: TripPoint;
}
