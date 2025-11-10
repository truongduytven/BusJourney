import Account from '../models/Accounts';
import Role from '../models/Role';
import bcrypt from 'bcrypt';

interface StaffFilters {
  search?: string;
  isActive?: boolean;
  pageSize?: number;
  pageNumber?: number;
}

interface CreateStaffData {
  name: string;
  email: string;
  phone: string;
  password: string;
  companyId: string;
  createdBy: string;
}

class StaffService {
  /**
   * Get paginated list of staff for a company
   */
  async getStaffList(companyId: string, filters: StaffFilters) {
    try {
      const {
        search,
        isActive,
        pageSize = 10,
        pageNumber = 1,
      } = filters;

      // Get staff role ID
      const staffRole = await Role.query().findOne({ name: 'staff' });
      if (!staffRole) {
        throw new Error('Staff role not found');
      }

      let query = Account.query()
        .where('company_id', companyId)
        .where('role_id', staffRole.id)
        .orderBy('create_at', 'desc');

      // Apply search filter
      if (search) {
        query = query.where((builder) => {
          builder
            .where('name', 'like', `%${search}%`)
            .orWhere('email', 'like', `%${search}%`)
            .orWhere('phone', 'like', `%${search}%`);
        });
      }

      // Apply active status filter
      if (isActive !== undefined) {
        query = query.where('is_active', isActive);
      }

      // Get total count
      const totalQuery = query.clone();
      const total = await totalQuery.resultSize();

      // Apply pagination
      const offset = (pageNumber - 1) * pageSize;
      const staffList = await query.limit(pageSize).offset(offset);

      // Remove sensitive data
      const safeStaffList = staffList.map((staff) => ({
        id: staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        avatar: staff.avatar,
        address: staff.address,
        isActive: staff.isActive,
        isVerified: staff.isVerified,
        createAt: staff.createAt,
      }));

      return {
        data: safeStaffList,
        pagination: {
          total,
          pageSize,
          pageNumber,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      console.error('Error in getStaffList:', error);
      throw error;
    }
  }

  /**
   * Get staff by ID
   */
  async getStaffById(staffId: string, companyId: string) {
    try {
      const staffRole = await Role.query().findOne({ name: 'staff' });
      if (!staffRole) {
        throw new Error('Staff role not found');
      }

      const staff = await Account.query()
        .findById(staffId)
        .where('company_id', companyId)
        .where('role_id', staffRole.id)
        .first();

      if (!staff) {
        throw new Error('Staff not found');
      }

      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        avatar: staff.avatar,
        address: staff.address,
        isActive: staff.isActive,
        isVerified: staff.isVerified,
        createAt: staff.createAt,
      };
    } catch (error) {
      console.error('Error in getStaffById:', error);
      throw error;
    }
  }

  /**
   * Create new staff account
   */
  async createStaff(data: CreateStaffData) {
    try {
      const { name, email, phone, password, companyId, createdBy } = data;

      // Check if email already exists
      const existingAccount = await Account.query().findOne({ email });
      if (existingAccount) {
        throw new Error('Email already exists');
      }

      // Check if phone already exists
      const existingPhone = await Account.query().findOne({ phone });
      if (existingPhone) {
        throw new Error('Phone number already exists');
      }

      // Get staff role
      const staffRole = await Role.query().findOne({ name: 'staff' });
      if (!staffRole) {
        throw new Error('Staff role not found');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create staff account
      const staff = await Account.query().insert({
        name,
        email,
        phone,
        password: hashedPassword,
        roleId: staffRole.id,
        companyId,
        type: 'local',
        isVerified: true, // Staff accounts are pre-verified
        isActive: true,
        avatar: '',
        address: '',
        otpCode: '',
      });

      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        avatar: staff.avatar,
        address: staff.address,
        isActive: staff.isActive,
        isVerified: staff.isVerified,
        createAt: staff.createAt,
      };
    } catch (error) {
      console.error('Error in createStaff:', error);
      throw error;
    }
  }

  /**
   * Update staff information
   */
  async updateStaff(staffId: string, companyId: string, data: Partial<CreateStaffData>) {
    try {
      const staffRole = await Role.query().findOne({ name: 'staff' });
      if (!staffRole) {
        throw new Error('Staff role not found');
      }

      // Check if staff exists and belongs to the company
      const staff = await Account.query()
        .findById(staffId)
        .where('company_id', companyId)
        .where('role_id', staffRole.id)
        .first();

      if (!staff) {
        throw new Error('Staff not found');
      }

      // Check email uniqueness if updating email
      if (data.email && data.email !== staff.email) {
        const existingEmail = await Account.query().findOne({ email: data.email });
        if (existingEmail) {
          throw new Error('Email already exists');
        }
      }

      // Check phone uniqueness if updating phone
      if (data.phone && data.phone !== staff.phone) {
        const existingPhone = await Account.query().findOne({ phone: data.phone });
        if (existingPhone) {
          throw new Error('Phone number already exists');
        }
      }

      // Update staff
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;
      if (data.phone) updateData.phone = data.phone;
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      const updatedStaff = await Account.query().patchAndFetchById(staffId, updateData);

      return {
        id: updatedStaff.id,
        name: updatedStaff.name,
        email: updatedStaff.email,
        phone: updatedStaff.phone,
        avatar: updatedStaff.avatar,
        address: updatedStaff.address,
        isActive: updatedStaff.isActive,
        isVerified: updatedStaff.isVerified,
        createAt: updatedStaff.createAt,
      };
    } catch (error) {
      console.error('Error in updateStaff:', error);
      throw error;
    }
  }

  /**
   * Toggle staff active status
   */
  async toggleStaffStatus(staffId: string, companyId: string) {
    try {
      const staffRole = await Role.query().findOne({ name: 'staff' });
      if (!staffRole) {
        throw new Error('Staff role not found');
      }

      const staff = await Account.query()
        .findById(staffId)
        .where('company_id', companyId)
        .where('role_id', staffRole.id)
        .first();

      if (!staff) {
        throw new Error('Staff not found');
      }

      const updatedStaff = await Account.query().patchAndFetchById(staffId, {
        isActive: !staff.isActive,
      });

      return {
        id: updatedStaff.id,
        name: updatedStaff.name,
        email: updatedStaff.email,
        phone: updatedStaff.phone,
        avatar: updatedStaff.avatar,
        address: updatedStaff.address,
        isActive: updatedStaff.isActive,
        isVerified: updatedStaff.isVerified,
        createAt: updatedStaff.createAt,
      };
    } catch (error) {
      console.error('Error in toggleStaffStatus:', error);
      throw error;
    }
  }

  /**
   * Bulk toggle staff active status
   */
  async bulkToggleActive(staffIds: string[], isActive: boolean, companyId: string): Promise<number> {
    try {
      const staffRole = await Role.query().findOne({ name: 'staff' });
      if (!staffRole) {
        throw new Error('Staff role not found');
      }

      // Update multiple staff at once, ensuring they belong to the company
      const result = await Account.query()
        .whereIn('id', staffIds)
        .where('company_id', companyId)
        .where('role_id', staffRole.id)
        .patch({ isActive: isActive });

      return result;
    } catch (error) {
      console.error('Error in bulkToggleActive:', error);
      throw error;
    }
  }
}

export default new StaffService();
