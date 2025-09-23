export interface SearchTrips {
  message: string;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  listBus: TypeBus[];
  listCompany: TypeCompany[];
  data: TripResults[];
}

export interface TripDetail {
  
}

export interface TripResults {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  status: string;
  routeId: string;
  templateId: string;
  busId: string;
  avgRating: string;
  numberComments: string;
  buses: busData;
  route: routeData;
}

export interface TripSearchPayload {
  fromCityId: string;
  toCityId: string;
  departureDate: string; // yyyy-mm-dd
  pageNumber?: number;
  pageSize?: number;
  companiesId?: string[];
  typeBus?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface TypeBus {
  id: string;
  name: string;
  quantity: string;
}

export interface TypeCompany {
  id: string;
  name: string;
  quantity: string;
}

export interface busData {
  id: string;
  companyId: string;
  licensePlate: string;
  typeBusId: string;
  images: string[];
  extensions: string[];
  isActive: boolean;
  bus_companies: busCompanyData;
  type_buses: typeBusData;
}

export interface busCompanyData {
  id: string;
  name: string;
  address: string;
  phone: string;
  createAt: Date;
  status: boolean;
  coupons: CouponData[];
}

export interface typeBusData {
  id: string;
  name: string;
  totalSeats: number;
  numberRows: number;
  numberCols: number;
  isFloors: boolean;
  numberRowsFloor?: number;
  numberColsFloor?: number;
}

export interface routeData {
  id: string;
  startLocationId: string;
  endLocationId: string;
  distance: string;
  duration: string;
  startLocation: {
    id: string;
    cityId: string;
    name: string;
  };
  endLocation: {
    id: string;
    cityId: string;
    name: string;
  };
}

export interface CouponData {
  id: string;
  description: string;
  discountType: string;
  discountValue: string;
  maxDiscountValue?: string;
  maxUses: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  status: string;
  companyId?: string;
  createdBy: string;
}
