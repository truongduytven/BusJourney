import BusRoute from '../models/BusRoute';
import Route from '../models/Route';
import BusCompany from '../models/BusCompany';

export class BusRouteService {
  // Lấy danh sách bus routes của company (có filter và search)
  static async listBusRoutes(
    companyId: string,
    page: number = 1,
    pageSize: number = 10,
    status?: boolean,
    search?: string
  ) {
    let query = BusRoute.query()
      .where('busCompanyId', companyId)
      .withGraphFetched('[route.[startLocation, endLocation], company]');

    // Filter by status
    if (status !== undefined) {
      query = query.where('status', status);
    }

    // Search by route locations
    if (search) {
      query = query.whereExists(
        Route.query()
          .select(1)
          .whereColumn('routes.id', 'bus_routes.route_id')
          .whereExists(function() {
            this.select(1)
              .from('locations')
              .whereRaw('locations.id = routes.start_location_id OR locations.id = routes.end_location_id')
              .whereRaw('LOWER(locations.name) LIKE ?', [`%${search.toLowerCase()}%`]);
          })
      );
    }

    const offset = (page - 1) * pageSize;
    const busRoutes = await query.limit(pageSize).offset(offset);

    const total = await BusRoute.query()
      .where('busCompanyId', companyId)
      .resultSize();

    return {
      data: busRoutes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // Lấy chi tiết một bus route
  static async getBusRouteById(id: string, companyId: string) {
    const busRoute = await BusRoute.query()
      .findById(id)
      .where('busCompanyId', companyId)
      .withGraphFetched('[route.[startLocation, endLocation], company]');

    if (!busRoute) {
      throw new Error('Không tìm thấy tuyến xe này hoặc bạn không có quyền truy cập');
    }

    return busRoute;
  }

  // Company tạo bus route mới (chọn route có sẵn)
  static async createBusRoute(data: {
    routeId: string;
    busCompanyId: string;
    status?: boolean;
  }) {
    // Kiểm tra route có tồn tại và đã được duyệt chưa
    const route = await Route.query().findById(data.routeId);
    if (!route) {
      throw new Error('Tuyến đường không tồn tại');
    }
    if (route.status !== 'Approved') {
      throw new Error('Tuyến đường chưa được duyệt. Chỉ có thể chọn tuyến đã được duyệt.');
    }

    // Kiểm tra company có tồn tại không
    const company = await BusCompany.query().findById(data.busCompanyId);
    if (!company) {
      throw new Error('Công ty không tồn tại');
    }

    // Kiểm tra bus route đã tồn tại chưa
    const existingBusRoute = await BusRoute.query()
      .where('routeId', data.routeId)
      .where('busCompanyId', data.busCompanyId)
      .first();

    if (existingBusRoute) {
      throw new Error('Tuyến xe này đã tồn tại trong hệ thống của công ty');
    }

    const busRoute = await BusRoute.query().insert({
      routeId: data.routeId,
      busCompanyId: data.busCompanyId,
      status: data.status !== undefined ? data.status : true,
    });

    return await this.getBusRouteById(busRoute.id, data.busCompanyId);
  }

  // Company cập nhật status của bus route
  static async updateBusRouteStatus(id: string, companyId: string, status: boolean) {
    const busRoute = await BusRoute.query()
      .findById(id)
      .where('busCompanyId', companyId)
      .first();

    if (!busRoute) {
      throw new Error('Không tìm thấy tuyến xe này hoặc bạn không có quyền truy cập');
    }

    await BusRoute.query().patchAndFetchById(id, { status });

    return await this.getBusRouteById(id, companyId);
  }

  // Company xóa bus route
  static async deleteBusRoute(id: string, companyId: string) {
    const busRoute = await BusRoute.query()
      .findById(id)
      .where('busCompanyId', companyId)
      .first();

    if (!busRoute) {
      throw new Error('Không tìm thấy tuyến xe này hoặc bạn không có quyền truy cập');
    }

    // Kiểm tra xem có trip nào đang sử dụng bus route này không
    const hasTrips = await BusRoute.relatedQuery('trips')
      .for(id)
      .resultSize();

    if (hasTrips > 0) {
      throw new Error('Không thể xóa tuyến xe này vì đang có chuyến đi sử dụng');
    }

    await BusRoute.query().deleteById(id);

    return { message: 'Xóa tuyến xe thành công' };
  }

  // Lấy danh sách routes đã được duyệt để company chọn
  static async getApprovedRoutes(page: number = 1, pageSize: number = 100) {
    const offset = (page - 1) * pageSize;

    const routes = await Route.query()
      .where('status', 'Approved')
      .withGraphFetched('[startLocation, endLocation]')
      .limit(pageSize)
      .offset(offset);

    const total = await Route.query()
      .where('status', 'Approved')
      .resultSize();

    return {
      data: routes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
