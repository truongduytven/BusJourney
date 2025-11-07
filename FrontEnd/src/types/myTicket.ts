// Ticket status types
export type TicketStatus = 'pending' | 'valid' | 'checked';
export type TicketStatusFilter = 'all' | TicketStatus;

// Basic ticket info for card display
export interface MyTicket {
  id: string;
  ticketCode: string;
  status: TicketStatus;
  seatCode: string;
  purchaseDate: string;
  trip: {
    id: string;
    departureTime: string;
    arrivalTime: string;
    price: string;
    route: {
      from: {
        city: string;
        location: string;
      };
      to: {
        city: string;
        location: string;
      };
    };
    busCompany: {
      name: string;
    };
  };
  order: {
    id: string;
    finalAmount: number;
    status: string;
    originAmount: number;
    // coupon: {
    //   couponId: string;
    //   couponName: string;
    //   discountPercentage: number;
    // } | null;
  };
  pickUpPoint: {
    id: string;
    name: string;
  };
  dropOffPoint: {
    id: string;
    name: string;
  };
}

// Detailed ticket info for modal
export interface TicketDetail {
  ticketId: string;
  ticketCode: string;
  status: TicketStatus;
  seatCode: string;
  qrCode: string | null;
  purchaseDate: string;
  checkedDate: string | null;
  trip: {
    tripId: string;
    departureTime: string;
    arrivalTime: string;
    departureDate: string;
    price: number;
    route: {
      routeId: string;
      distance: number;
      startLocation: {
        locationId: string;
        locationName: string;
        city: {
          cityId: string;
          cityName: string;
        };
      };
      endLocation: {
        locationId: string;
        locationName: string;
        city: {
          cityId: string;
          cityName: string;
        };
      };
    };
    busCompany: {
      busCompanyId: string;
      busCompanyName: string;
      avatar: string | null;
      phoneNumber: string;
      email: string;
    };
    bus: {
      busId: string;
      busNumber: string;
      licensePlate: string;
      typeBus: {
        typeBusId: string;
        typeBusName: string;
        numberOfSeat: number;
      };
    };
  };
  order: {
    orderId: string;
    finalAmount: number;
    originAmount: number;
    createdAt: string;
    transaction: {
      transactionId: string;
      transactionCode: string;
      amount: number;
      paymentMethod: string;
      status: string;
      transactionDate: string;
    } | null;
    coupon: {
      couponId: string;
      couponName: string;
      couponCode: string;
      discountPercentage: number;
    } | null;
  };
  pickUpPoint: {
    pointId: string;
    pointName: string;
    address: string;
    time: string;
  };
  dropOffPoint: {
    pointId: string;
    pointName: string;
    address: string;
    time: string;
  };
  account: {
    accountId: string;
    fullname: string;
    phone: string;
    email: string;
  };
  checker: {
    accountId: string;
    fullname: string;
  } | null;
}

// Response types
export interface MyTicketsResponse {
  success: boolean;
  message: string;
  data: {
    tickets: MyTicket[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface TicketDetailResponse {
  success: boolean;
  message: string;
  data: TicketDetail;
}

// State type for Redux
export interface MyTicketState {
  tickets: MyTicket[];
  currentTicket: TicketDetail | null;
  status: TicketStatusFilter;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  // Cache for different status tabs
  cache: {
    [key in TicketStatusFilter]?: {
      [page: number]: {
        tickets: MyTicket[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
        timestamp: number;
      };
    };
  };
  // Cache for ticket details
  detailCache: {
    [ticketId: string]: {
      data: TicketDetail;
      timestamp: number;
    };
  };
  lastFetch: {
    status: TicketStatusFilter | null;
    page: number | null;
    timestamp: number;
  };
}
