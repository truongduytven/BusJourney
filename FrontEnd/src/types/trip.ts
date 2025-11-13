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
  tripId: string;
  coupons: ICoupon[];
  points: ITripPoint;
  rating: IListRating;
  companyPolicies: ICompanyPolicy[];
  cancellationRules: ICancellationRule[];
  images: string[];
  extensions:string[];
}

export interface ICompanyPolicy {
  id: string;
  policyType: string;
  title: string;
  content: string;
}

export interface ICancellationRule {
  id: string;
  timeBeforeDeparture: number;
  refundPercentage: number;
  feeAmount: number;
}
export interface IListRating {
  average: string;
  totalReviews: number;
  countHaveDescription: number;
  countHaveImage: number;
  typebus: string;
  route: string;
  list: IListRatingItem[];
}

interface IListRatingItem {
  id: string;
  tripId: string;
  rating: number;
  commenttext: string;
  createAt: Date;
  createdBy: string;
  isVisible: boolean;
  account: {
    id: string;
    name: string;
    avatar: string;
  }
}

interface ITripPoint {
  startPoint: IPoint[];
  endPoint: IPoint[];
}

export interface IPoint {
  id: string;
  type: string;
  time: Date;
  locationName: string;
}

export interface ICoupon {
  id: string;
  discountType: string;
  discountValue: string;
  description: string;
  validFrom: Date;
  validTo: Date;
  maxDiscountValue?: string;
  status: string;
}

export interface ITripSeatResult {
  tripId: string;
  price: string;
  typeName: string;
  totalSeats: number;
  numberCols: number;
  numberRows: number;
  isFloor: boolean;
  numberColsFloor?: number;
  numberRowsFloor?: number;
  seats: ISeat[];
  bookedSeats: string[];
  points: ITripPoint;
}

export interface ISeat {
  id: string;
  code: string;
  indexCol: number;
  indexRow: number;
  floor: number;
  typeBusId: string;
}
export interface TripResults {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  status: string;
  busRoutesId: string;
  templateId: string;
  busId: string;
  avgRating: string;
  numberComments: string;
  buses: busData;
  busRoute: busRouteData;
}

export interface busRouteData {
  id: string;
  busCompanyId: string;
  routeId: string;
  route: routeData;
  status: boolean;
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
  createdBy: string | null;
  status: string;
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
