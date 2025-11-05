export interface UserPayload {
  roleName?: string;
  type?: string; // Account type filter
  isVerified?: boolean; // Verification status filter
  isActive?: boolean; // Active status filter
  search?: string; // Search by email or name
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
  roleName?: string; // Role name from relation
  roles?: {
    id: string;
    name: string;
  };
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

export interface Role {
  id: string;
  name: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roleId: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  roleId?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface Role {
  id: string;
  name: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roleId: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  roleId?: string;
  isVerified?: boolean;
  isActive?: boolean;
}