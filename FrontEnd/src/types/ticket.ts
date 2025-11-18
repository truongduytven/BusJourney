// Ticket interfaces
export interface Ticket {
  id: string;
  ticketCode: string;
  orderId: string;
  userId: string;
  tripId: string;
  seatCode: string;
  qrCode: string | null;
  status: string;
  purchaseDate: string;
  checkedDate: string | null;
  checkedBy: string | null;
  pickupPointId: string | null;
  dropoffPointId: string | null;
  
  // Relations
  account?: User;
  order?: Order;
  trip?: Trip;
  pickUpPoint?: Point;
  dropOffPoint?: Point;
  checker?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type?: string;
}

export interface Order {
  id: string;
  originAmount: number;
  finalAmount: number;
  status: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: string;
  busCompanyId: string;
  
  // Relations
  busRoute?: {
    route?: {
      startLocation?: Location;
      endLocation?: Location;
    };
  };
  template?: Template;
  busCompany?: BusCompany;
}

export interface Template {
  id: string;
  name: string;
}

export interface BusCompany {
  id: string;
  name: string;
}

export interface Point {
  id: string;
  locationName: string;
  type: string;
  isActive: boolean;
}

export interface Location {
  id: string;
  name: string;
}

// Request interfaces
export interface UpdateTicketRequest {
  status?: string;
  pickupPointId?: string;
  dropoffPointId?: string;
  seatCode?: string;
  checkedBy?: string;
}

// Filter interfaces
export interface TicketFilters {
  search?: string;
  status?: string;
  userId?: string;
  tripId?: string;
  orderId?: string;
}

// Response interfaces
export interface TicketListResponse {
  tickets: Ticket[];
  totalTickets: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}
