export type PartnerStatus = 'processed' | 'unprocessed';

export interface Partner {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  message: string | null;
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerListResponse {
  partners: Partner[];
  totalPartners: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}

export interface PartnerStats {
  total: number;
  processed: number;
  unprocessed: number;
}

export interface PartnerRegistrationData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  message?: string;
}

export interface PartnerFilters {
  status?: PartnerStatus;
  search?: string;
  pageSize?: number;
  pageNumber?: number;
}
