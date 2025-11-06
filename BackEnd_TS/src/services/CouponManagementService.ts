import Coupon from '../models/Coupon';

interface CouponListFilters {
  status?: string;
  search?: string;
  companyId?: string;
  discountType?: string;
  pageSize?: number;
  pageNumber?: number;
}

interface CouponListResponse {
  coupons: Coupon[];
  totalCoupons: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}

class CouponManagementService {
  /**
   * Get paginated list of coupons with filters
   */
  async getListCoupons(filters: CouponListFilters): Promise<CouponListResponse> {
    const {
      status,
      search,
      companyId,
      discountType,
      pageSize = 10,
      pageNumber = 1,
    } = filters;

    let query = Coupon.query().withGraphFetched('[company]');

    // Apply filters
    if (status) {
      query = query.where('coupons.status', status);
    }

    if (search) {
      query = query.where('coupons.description', 'ilike', `%${search}%`);
    }

    if (companyId) {
      query = query.where('coupons.company_id', companyId);
    }

    if (discountType) {
      query = query.where('coupons.discount_type', discountType);
    }

    // Count total records
    const countQuery = query.clone();
    const total = await countQuery.resultSize();

    // Apply pagination
    const offset = (pageNumber - 1) * pageSize;
    const coupons = await query
      .limit(pageSize)
      .offset(offset)

    return {
      coupons,
      totalCoupons: total,
      totalPage: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      pageSize,
    };
  }

  /**
   * Get coupon by ID
   */
  async getCouponById(id: string): Promise<Coupon> {
    const coupon = await Coupon.query()
      .findById(id)
      .withGraphFetched('[company]');

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    return coupon;
  }

  /**
   * Create new coupon
   */
  async createCoupon(data: {
    description: string;
    discountType: string;
    discountValue: number;
    maxDiscountValue?: number;
    maxUses: number;
    validFrom: Date;
    validTo: Date;
    status?: string;
    companyId?: string;
    createdBy: string;
  }): Promise<Coupon> {
    // Validate dates
    if (new Date(data.validFrom) >= new Date(data.validTo)) {
      throw new Error('Valid from date must be before valid to date');
    }

    // Validate discount value
    if (data.discountType === 'percentage' && (data.discountValue <= 0 || data.discountValue > 100)) {
      throw new Error('Percentage discount must be between 0 and 100');
    }

    if (data.discountType === 'fixed' && data.discountValue <= 0) {
      throw new Error('Fixed discount must be greater than 0');
    }

    const coupon = await Coupon.query().insert({
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxDiscountValue: data.maxDiscountValue,
      maxUses: data.maxUses,
      usedCount: 0,
      validFrom: data.validFrom,
      validTo: data.validTo,
      status: data.status || 'active',
      companyId: data.companyId,
      createdBy: data.createdBy,
    });

    return coupon;
  }

  /**
   * Update coupon
   */
  async updateCoupon(
    id: string,
    data: Partial<{
      description: string;
      discountType: string;
      discountValue: number;
      maxDiscountValue: number;
      maxUses: number;
      validFrom: Date;
      validTo: Date;
      status: string;
      companyId: string;
    }>
  ): Promise<Coupon> {
    const coupon = await Coupon.query().findById(id);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    // Validate dates if both are provided
    if (data.validFrom || data.validTo) {
      const validFrom = data.validFrom || coupon.validFrom;
      const validTo = data.validTo || coupon.validTo;
      
      if (new Date(validFrom) >= new Date(validTo)) {
        throw new Error('Valid from date must be before valid to date');
      }
    }

    // Validate discount value if being updated
    if (data.discountValue !== undefined) {
      const discountType = data.discountType || coupon.discountType;
      
      if (discountType === 'percentage' && (data.discountValue <= 0 || data.discountValue > 100)) {
        throw new Error('Percentage discount must be between 0 and 100');
      }

      if (discountType === 'fixed' && data.discountValue <= 0) {
        throw new Error('Fixed discount must be greater than 0');
      }
    }

    const updatedCoupon = await Coupon.query()
      .patchAndFetchById(id, {
        ...(data.description && { description: data.description }),
        ...(data.discountType && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
        ...(data.maxDiscountValue !== undefined && { maxDiscountValue: data.maxDiscountValue }),
        ...(data.maxUses !== undefined && { maxUses: data.maxUses }),
        ...(data.validFrom && { validFrom: data.validFrom }),
        ...(data.validTo && { validTo: data.validTo }),
        ...(data.status && { status: data.status }),
        ...(data.companyId !== undefined && { companyId: data.companyId }),
      });

    return updatedCoupon;
  }

  /**
   * Toggle coupon status (active <-> inactive)
   */
  async toggleCouponStatus(id: string): Promise<Coupon> {
    const coupon = await Coupon.query().findById(id);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    const newStatus = coupon.status === 'active' ? 'inactive' : 'active';

    const updatedCoupon = await Coupon.query()
      .patchAndFetchById(id, { status: newStatus });

    return updatedCoupon;
  }

  /**
   * Extend coupon expiration date
   */
  async extendCoupon(id: string, newValidTo: Date): Promise<Coupon> {
    const coupon = await Coupon.query().findById(id);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    // Validate new expiration date
    const now = new Date();
    const newExpirationDate = new Date(newValidTo);

    if (newExpirationDate <= now) {
      throw new Error('New expiration date must be in the future');
    }

    if (newExpirationDate <= new Date(coupon.validFrom)) {
      throw new Error('New expiration date must be after the start date');
    }

    const updatedCoupon = await Coupon.query()
      .patchAndFetchById(id, { 
        validTo: newValidTo,
        status: 'active' // Automatically reactivate when extending
      });

    return updatedCoupon;
  }
}

export default new CouponManagementService();
