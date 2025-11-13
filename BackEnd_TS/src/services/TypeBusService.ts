import TypeBus from '../models/TypeBus';
import Seat from '../models/Seat';

interface SeatData {
  code: string;
  indexCol: number;
  indexRow: number;
  floor: number;
}

export class TypeBusService {
  // Lấy danh sách type buses với phân trang và filters
  static async listTypeBuses(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    isFloors?: boolean,
    busCompanyId?: string // Filter by company
  ) {
    const offset = (page - 1) * pageSize;
    
    let query = TypeBus.query().withGraphFetched('busCompany');

    // Apply company filter (for company users)
    if (busCompanyId) {
      query = query.where('busCompanyId', busCompanyId);
    }

    // Apply search filter
    if (search) {
      query = query.where('name', 'ilike', `%${search}%`);
    }

    // Apply isFloors filter
    if (isFloors !== undefined) {
      query = query.where('isFloors', isFloors);
    }

    const typeBuses = await query
      .limit(pageSize)
      .offset(offset)

    const total = await query.resultSize();

    return {
      data: typeBuses,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  // Lấy chi tiết một type bus
  static async getTypeBusById(id: string, busCompanyId?: string) {
    let query = TypeBus.query().findById(id).withGraphFetched('[busCompany, seat]');
    
    const typeBus = await query;
    
    if (!typeBus) {
      throw new Error('Không tìm thấy loại xe');
    }

    // Check permission if company user
    if (busCompanyId && typeBus.busCompanyId !== busCompanyId) {
      throw new Error('Bạn không có quyền xem loại xe này');
    }
    
    return typeBus;
  }

  // Tạo type bus mới
  static async createTypeBus(data: {
    name: string;
    totalSeats: number;
    numberRows: number;
    numberCols: number;
    isFloors: boolean;
    numberRowsFloor?: number;
    numberColsFloor?: number;
    busCompanyId?: string; // Company creating the type bus
    seats?: SeatData[]; // Optional seats array
  }) {
    // Kiểm tra tên đã tồn tại chưa (trong company nếu có)
    let existingQuery = TypeBus.query().where('name', data.name);
    
    if (data.busCompanyId) {
      existingQuery = existingQuery.where('busCompanyId', data.busCompanyId);
    }
    
    const existingTypeBus = await existingQuery.first();

    if (existingTypeBus) {
      throw new Error('Loại xe này đã tồn tại');
    }

    // Validate số ghế
    const calculatedSeats = data.numberRows * data.numberCols;
    const floorSeats = data.isFloors && data.numberRowsFloor && data.numberColsFloor 
      ? data.numberRowsFloor * data.numberColsFloor 
      : 0;

    const typeBus = await TypeBus.query().insertGraph({
      name: data.name,
      totalSeats: data.totalSeats,
      numberRows: data.numberRows,
      numberCols: data.numberCols,
      isFloors: data.isFloors,
      numberRowsFloor: data.numberRowsFloor,
      numberColsFloor: data.numberColsFloor,
      busCompanyId: data.busCompanyId,
      seat: data.seats || []
    } as any);

    return await this.getTypeBusById(typeBus.id, data.busCompanyId);
  }

  // Cập nhật type bus
  static async updateTypeBus(id: string, data: {
    name?: string;
    totalSeats?: number;
    numberRows?: number;
    numberCols?: number;
    isFloors?: boolean;
    numberRowsFloor?: number;
    numberColsFloor?: number;
    seats?: SeatData[]; // Optional seats array
  }, busCompanyId?: string) {
    const typeBus = await TypeBus.query().findById(id);
    
    if (!typeBus) {
      throw new Error('Không tìm thấy loại xe');
    }

    // Check permission if company user
    if (busCompanyId && typeBus.busCompanyId !== busCompanyId) {
      throw new Error('Bạn không có quyền chỉnh sửa loại xe này');
    }

    // Kiểm tra tên trùng (nếu đổi tên)
    if (data.name && data.name !== typeBus.name) {
      let existingQuery = TypeBus.query()
        .where('name', data.name)
        .whereNot('id', id);

      if (typeBus.busCompanyId) {
        existingQuery = existingQuery.where('busCompanyId', typeBus.busCompanyId);
      }

      const existingTypeBus = await existingQuery.first();

      if (existingTypeBus) {
        throw new Error('Tên loại xe này đã tồn tại');
      }
    }

    // Validate số ghế nếu có thay đổi
    const updatedData = { ...typeBus, ...data };
    const calculatedSeats = updatedData.numberRows * updatedData.numberCols;
    const floorSeats = updatedData.isFloors && updatedData.numberRowsFloor && updatedData.numberColsFloor 
      ? updatedData.numberRowsFloor * updatedData.numberColsFloor 
      : 0;

    await TypeBus.query().patchAndFetchById(id, data);

    // Update seats if provided
    if (data.seats) {
      // Delete old seats
      await Seat.query().where('typeBusId', id).delete();
      
      // Insert new seats
      if (data.seats.length > 0) {
        await Seat.query().insert(
          data.seats.map(seat => ({
            ...seat,
            typeBusId: id
          }))
        );
      }
    }

    return await this.getTypeBusById(id, busCompanyId);
  }

  // Xóa type bus
  static async deleteTypeBus(id: string, busCompanyId?: string) {
    const typeBus = await TypeBus.query().findById(id);
    
    if (!typeBus) {
      throw new Error('Không tìm thấy loại xe');
    }

    // Check permission if company user
    if (busCompanyId && typeBus.busCompanyId !== busCompanyId) {
      throw new Error('Bạn không có quyền xóa loại xe này');
    }

    // Kiểm tra có xe nào đang sử dụng không
    const buses = await typeBus.$relatedQuery('buses');
    if (buses.length > 0) {
      throw new Error('Không thể xóa loại xe đang được sử dụng');
    }

    await TypeBus.query().deleteById(id);
    await Seat.query().where('typeBusId', id).delete();
    return { message: 'Xóa loại xe thành công' };
  }
}
