import Route from '../models/Route';
import Location from '../models/Location';

export class RouteService {
  // Lấy danh sách routes với phân trang
  static async listRoutes(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;
    
    const routes = await Route.query()
      .withGraphFetched('[startLocation, endLocation]')
      .limit(pageSize)
      .offset(offset);

    const total = await Route.query().resultSize();

    return {
      data: routes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  // Lấy chi tiết một route
  static async getRouteById(id: string) {
    const route = await Route.query()
      .findById(id)
      .withGraphFetched('[startLocation, endLocation]');
    
    if (!route) {
      throw new Error('Không tìm thấy tuyến đường');
    }
    
    return route;
  }

  // Tạo route mới
  static async createRoute(data: {
    startLocationId: string;
    endLocationId: string;
    distance: number;
    status?: string;
    createdBy?: string;
  }) {
    // Kiểm tra locations tồn tại
    const startLocation = await Location.query().findById(data.startLocationId);
    const endLocation = await Location.query().findById(data.endLocationId);

    if (!startLocation || !endLocation) {
      throw new Error('Địa điểm không hợp lệ');
    }

    // Kiểm tra route đã tồn tại chưa
    const existingRoute = await Route.query()
      .where('startLocationId', data.startLocationId)
      .where('endLocationId', data.endLocationId)
      .first();

    if (existingRoute) {
      throw new Error('Tuyến đường này đã tồn tại');
    }

    const route = await Route.query().insert({
      startLocationId: data.startLocationId,
      endLocationId: data.endLocationId,
      distanceKm: data.distance,
      status: data.status || 'Pending',
      createdBy: data.createdBy
    });

    return await this.getRouteById(route.id);
  }

  // Cập nhật status của route (chỉ Admin)
  static async updateRouteStatus(id: string, status: 'Approved' | 'Rejected' | 'Pending') {
    const route = await Route.query().findById(id);
    
    if (!route) {
      throw new Error('Không tìm thấy tuyến đường');
    }

    await Route.query().patchAndFetchById(id, { status });

    return await this.getRouteById(id);
  }

  // Xóa route
  static async deleteRoute(id: string) {
    const route = await Route.query().findById(id);
    
    if (!route) {
      throw new Error('Không tìm thấy tuyến đường');
    }

    await Route.query().deleteById(id);
    
    return { message: 'Xóa tuyến đường thành công' };
  }

  // Bulk update status nhiều routes (Admin only)
  static async bulkUpdateRouteStatus(ids: string[], status: 'Approved' | 'Rejected' | 'Pending') {
    if (!ids || ids.length === 0) {
      throw new Error('Danh sách ID không hợp lệ');
    }

    const count = await Route.query()
      .whereIn('id', ids)
      .patch({ status });

    return {
      count,
      status
    };
  }
}
