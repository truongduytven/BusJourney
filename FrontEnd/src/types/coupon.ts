export interface Coupon {
  id: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountValue?: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  status: string;
  companyId?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface CouponListPayload {
  status?: string;
  search?: string;
  companyId?: string;
  discountType?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface CouponListResponse {
  coupons: Coupon[];
  totalCoupons: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}
