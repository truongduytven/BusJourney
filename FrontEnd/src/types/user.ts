export interface UserPayload {
  roleName: string;
  pageSize: number;
  pageNumber: number;
}

export interface UserDataResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  type: string;
  address: string | null;
  isVerified: boolean;
  isActive: boolean;
}

export interface UserResponse {
  users: UserDataResponse[];
  totalPage: number;
  currentPage: number;
  pageSize: number;
  totalUsers: number;  
}