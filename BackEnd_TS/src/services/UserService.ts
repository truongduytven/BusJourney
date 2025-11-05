import Account from '../models/Accounts';
import Role from '../models/Role';

export interface getListUsersPayload {
  roleName?: string;
  type?: string; // Account type filter
  isVerified?: boolean; // Verification status filter
  isActive?: boolean; // Active status filter
  search?: string; // Search by email or name
  pageNumber: number;
  pageSize: number;
}

export interface UserListResponse {
  users: any[];
  totalPage: number;
  currentPage: number;
  pageSize: number;
  totalUsers: number;
}

class UserService {
  async getListUsers(payload: getListUsersPayload): Promise<UserListResponse> {
    const { roleName, type, isVerified, isActive, search, pageNumber, pageSize } = payload;

    const offset = (pageNumber - 1) * pageSize;

    // Build query
    let query = Account.query()
      .select('accounts.id', 'accounts.name', 'accounts.email', 'accounts.phone', 'accounts.avatar', 'accounts.type', 'accounts.role_id', 'accounts.company_id', 'accounts.is_verified', 'accounts.is_active')
      .withGraphFetched('roles')
      .modifyGraph('roles', (builder) => {
        builder.select('id', 'name');
      });

    // If roleName is provided, filter by role
    if (roleName) {
      const role = await Role.query().findOne({ name: roleName });

      if (!role) {
        throw new Error(`Role "${roleName}" not found`);
      }

      query = query.where('accounts.role_id', role.id);
    }

    // Filter by account type
    if (type) {
      query = query.where('accounts.type', type);
    }

    // Filter by verification status
    if (isVerified !== undefined) {
      query = query.where('accounts.is_verified', isVerified);
    }

    // Filter by active status
    if (isActive !== undefined) {
      query = query.where('accounts.is_active', isActive);
    }

    // Search by email or name
    if (search && search.trim()) {
      query = query.where((builder) => {
        builder
          .where('accounts.email', 'ilike', `%${search}%`)
          .orWhere('accounts.name', 'ilike', `%${search}%`);
      });
    }

    // Get total count
    const totalUsers = await query.resultSize();

    // Calculate total pages
    const totalPage = Math.ceil(totalUsers / pageSize);

    // Get users with pagination
    const users = await query
      .orderBy('accounts.create_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    return {
      users,
      totalPage,
      currentPage: pageNumber,
      pageSize,
      totalUsers
    };
  }
}

export default new UserService();