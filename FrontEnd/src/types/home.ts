export interface FeaturedRoute {
  id: string;
  from: {
    location: string;
    city: string;
  };
  to: {
    location: string;
    city: string;
  };
  distance: number;
  upcomingTripsCount: number;
  nextTrip: {
    id: string;
    departureTime: string;
    price: number;
    availableSeats: number;
  } | null;
}

export interface ActiveCoupon {
  id: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountValue: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
}

export interface FeaturedReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
  trip: {
    from: {
      location: string;
      city: string;
    };
    to: {
      location: string;
      city: string;
    };
  } | null;
}

export interface HomeDataResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
}
