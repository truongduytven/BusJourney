import Account from '../models/Accounts';
import Role from '../models/Role';
import bcrypt from 'bcrypt';

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

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    roleId: string;
    isVerified?: boolean;
    isActive?: boolean;
  }) {
    // Check if email already exists
    const existingUser = await Account.query().findOne({ email: data.email });
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Check if role exists
    const role = await Role.query().findById(data.roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const newUser = await Account.query()
      .insert({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role_id: data.roleId,
        type: 'normal',
        is_verified: data.isVerified ?? false,
        is_active: data.isActive ?? true
      })
      .returning('*');

    // Fetch with role relation
    const userWithRole = await Account.query()
      .findById(newUser.id)
      .withGraphFetched('roles')
      .modifyGraph('roles', (builder) => {
        builder.select('id', 'name');
      });

    return userWithRole;
  }

  async getUserById(id: string) {
    const user = await Account.query()
      .findById(id)
      .withGraphFetched('roles')
      .modifyGraph('roles', (builder) => {
        builder.select('id', 'name');
      });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(id: string, data: {
    name?: string;
    phone?: string;
    roleId?: string;
    isVerified?: boolean;
    isActive?: boolean;
  }) {
    const user = await Account.query().findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // If roleId is provided, check if it exists
    if (data.roleId) {
      const role = await Role.query().findById(data.roleId);
      if (!role) {
        throw new Error('Role not found');
      }
    }

    // Update user
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.roleId !== undefined) updateData.role_id = data.roleId;
    if (data.isVerified !== undefined) updateData.is_verified = data.isVerified;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    await Account.query()
      .findById(id)
      .patch(updateData);

    // Fetch updated user with role
    const updatedUser = await Account.query()
      .findById(id)
      .withGraphFetched('roles')
      .modifyGraph('roles', (builder) => {
        builder.select('id', 'name');
      });

    return updatedUser;
  }
}

export default new UserService();