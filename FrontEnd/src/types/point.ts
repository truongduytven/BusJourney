export interface Point {
  id: string;
  locationName: string;
  type: 'pickup' | 'dropoff';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PointListPayload {
  isActive?: boolean;
  search?: string;
  type?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface PointListResponse {
  points: Point[];
  totalPoints: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}
