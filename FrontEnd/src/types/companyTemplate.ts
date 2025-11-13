export interface Bus {
  id: string;
  licensePlate: string;
  typeBusId: string;
  type_buses?: {
    id: string;
    name: string;
    totalSeats: number;
  };
}

export interface BusRoute {
  id: string;
  routeId: string;
  route?: {
    id: string;
    distanceKm: number;
    startLocation?: {
      id: string;
      name: string;
    } | null;
    endLocation?: {
      id: string;
      name: string;
    } | null;
  };
}

export interface Template {
  id: string;
  name: string;
  companyId: string;
  busRoutesId: string;
  busId: string;
  isActive: boolean;
  bus?: Bus;
  busRoute?: BusRoute;
  company?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  busRoutesId: string;
  busId: string;
  is_active?: boolean;
}

export interface UpdateTemplateRequest extends Partial<CreateTemplateRequest> {}

export interface TemplateListResponse {
  success: boolean;
  message: string;
  data: Template[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface TemplateResponse {
  success: boolean;
  message: string;
  data: Template;
}

export interface BusRouteListResponse {
  success: boolean;
  data: BusRoute[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
