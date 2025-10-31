import Account from '../models/Accounts';
import Role from '../models/Role';

export interface getListUsersPayload {
  roleName: string;
  pageNumber: number;
  pageSize: number;
}

export interface UserListResponse {
  users: Account[];
  totalPage: number;
  currentPage: number;
  pageSize: number;
  totalUsers: number;
}

class UserService {
  async getListUsers(payload: getListUsersPayload): Promise<UserListResponse> {
    const { roleName, pageNumber, pageSize } = payload;

    const role = await Role.query().findOne({ name: roleName });

    if (!role) {
      throw new Error(`Role "${roleName}" not found`);
    }

    const offset = (pageNumber - 1) * pageSize;

    const totalUsers = await Account.query()
      .where('role_id', role.id)
      .resultSize();

    const totalPage = Math.ceil(totalUsers / pageSize);

    const users = await Account.query()
      .select('id', 'name', 'email', 'phone', 'avatar', 'type', 'address', 'role_id', 'company_id', 'is_verified', 'is_active')
      .where('role_id', role.id)
      .orderBy('create_at', 'desc')
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