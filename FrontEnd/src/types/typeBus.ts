export interface TypeBus {
    id: string;
    name: string;
    totalSeats: number;
    numberRows: number;
    numberCols: number;
    isFloors: boolean;
    numberRowsFloor?: number;
    numberColsFloor?: number;
    busCompanyId?: string;
    busCompany?: {
        id: string;
        name: string;
    };
    seats?: Seat[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Seat {
    id: string;
    code: string;
    floor: number;
    indexCol: number;
    indexRow: number;
}

export interface TypeBusListResponse {
  success: boolean;
  message: string;
  data: TypeBus[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface TypeBusCreateRequest {
  name: string;
  totalSeats: number;
  numberRows: number;
  numberCols: number;
  isFloors: boolean;
  numberRowsFloor?: number;
  numberColsFloor?: number;
  seat?: Array<{
    code: string;
    indexCol: number;
    indexRow: number;
    floor: number;
  }>;
}

export interface TypeBusUpdateRequest {
  name?: string;
  totalSeats?: number;
  numberRows?: number;
  numberCols?: number;
  isFloors?: boolean;
  numberRowsFloor?: number;
  numberColsFloor?: number;
  seat?: Array<{
    code: string;
    indexCol: number;
    indexRow: number;
    floor: number;
  }>;
}