import Partner from '../models/Partner';

interface PartnerListFilters {
  status?: 'processed' | 'unprocessed';
  search?: string;
  pageSize?: number;
  pageNumber?: number;
}

interface PartnerListResponse {
  partners: Partner[];
  totalPartners: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}

class PartnerService {
  /**
   * Register new partner (public endpoint - no auth required)
   */
  async registerPartner(data: {
    fullName: string;
    company: string;
    email: string;
    phone: string;
    message?: string;
  }): Promise<Partner> {
    // Check if email already registered
    const existingEmail = await Partner.query()
      .where('email', 'ilike', data.email)
      .first();

    if (existingEmail) {
      throw new Error('Email đã được đăng ký. Vui lòng sử dụng email khác.');
    }

    // Check if phone already registered
    const existingPhone = await Partner.query()
      .where('phone', data.phone)
      .first();

    if (existingPhone) {
      throw new Error('Số điện thoại đã được đăng ký. Vui lòng sử dụng số khác.');
    }

    // Create new partner registration
    const partner = await Partner.query().insert({
      fullName: data.fullName,
      company: data.company,
      email: data.email,
      phone: data.phone,
      message: data.message || null,
      status: 'unprocessed',
    });

    return partner;
  }

  /**
   * Get paginated list of partners with filters (admin only)
   */
  async getListPartners(filters: PartnerListFilters): Promise<PartnerListResponse> {
    const {
      status,
      search,
      pageSize = 10,
      pageNumber = 1,
    } = filters;

    let query = Partner.query().orderBy('created_at', 'desc');

    // Apply filters
    if (status) {
      query = query.where('status', status);
    }

    if (search) {
      query = query.where((builder) => {
        builder
          .where('full_name', 'ilike', `%${search}%`)
          .orWhere('company', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
          .orWhere('phone', 'ilike', `%${search}%`);
      });
    }

    // Count total records
    const countQuery = query.clone();
    const total = await countQuery.resultSize();

    // Apply pagination
    const offset = (pageNumber - 1) * pageSize;
    const partners = await query
      .limit(pageSize)
      .offset(offset);

    return {
      partners,
      totalPartners: total,
      totalPage: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      pageSize,
    };
  }

  /**
   * Get partner by ID (admin only)
   */
  async getPartnerById(id: string): Promise<Partner> {
    const partner = await Partner.query().findById(id);

    if (!partner) {
      throw new Error('Partner registration not found');
    }

    return partner;
  }

  /**
   * Update partner status (admin only)
   */
  async updatePartnerStatus(
    id: string,
    status: 'processed' | 'unprocessed'
  ): Promise<Partner> {
    const partner = await Partner.query().findById(id);

    if (!partner) {
      throw new Error('Partner registration not found');
    }

    const updatedPartner = await Partner.query()
      .patchAndFetchById(id, {
        status,
        updatedAt: new Date().toISOString(),
      });

    return updatedPartner;
  }

  /**
   * Delete partner registration (admin only)
   */
  async deletePartner(id: string): Promise<void> {
    const partner = await Partner.query().findById(id);

    if (!partner) {
      throw new Error('Partner registration not found');
    }

    await Partner.query().deleteById(id);
  }

  /**
   * Get statistics (admin only)
   */
  async getPartnerStats(): Promise<{
    total: number;
    processed: number;
    unprocessed: number;
  }> {
    const stats = await Partner.query()
      .select('status')
      .count('* as count')
      .groupBy('status');

    const result = {
      total: 0,
      processed: 0,
      unprocessed: 0,
    };

    stats.forEach((stat: any) => {
      const count = parseInt(stat.count);
      result.total += count;
      result[stat.status as keyof typeof result] = count;
    });

    return result;
  }
}

export default new PartnerService();
