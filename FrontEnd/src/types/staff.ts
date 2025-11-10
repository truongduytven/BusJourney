export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  isActive: boolean;
  isVerified: boolean;
  createAt: string;
}

export interface StaffListPayload {
  search?: string;
  isActive?: boolean;
  pageSize?: number;
  pageNumber?: number;
}

export interface StaffListResponse {
  data: Staff[];
  pagination: {
    total: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
  };
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface StaffState {
  staffList: Staff[];
  currentStaff: Staff | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
  };
}
