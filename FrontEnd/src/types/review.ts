// Review interfaces
export interface Review {
  id: string;
  tripId: string;
  companyId: string;
  rating: number;
  commenttext: string;
  createAt: string;
  createdBy: string;
  isVisible: boolean;
  
  // Relations
  account?: User;
  trip?: Trip;
  bus_companies?: BusCompany;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type?: string;
}

export interface Trip {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: string;
  
  // Relations
  busRoute?: {
    route?: {
      startLocation?: Location;
      endLocation?: Location;
    };
  };
  template?: Template;
}

export interface Template {
  id: string;
  name: string;
}

export interface BusCompany {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

// Request interfaces
export interface UpdateReviewRequest {
  commenttext?: string;
  rating?: number;
  isVisible?: boolean;
}

// Filter interfaces
export interface ReviewFilters {
  search?: string;
  rating?: number;
  isVisible?: boolean;
  tripId?: string;
  userId?: string;
}

// Response interfaces
export interface ReviewListResponse {
  reviews: Review[];
  totalReviews: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}
