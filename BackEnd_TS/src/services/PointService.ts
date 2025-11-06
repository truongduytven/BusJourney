import Point from '../models/Point';

interface PointListFilters {
  isActive?: boolean;
  search?: string;
  type?: string;
  pageSize?: number;
  pageNumber?: number;
}

interface PointListResponse {
  points: Point[];
  totalPoints: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}

class PointService {
  /**
   * Get paginated list of points with filters
   */
  async getListPoints(filters: PointListFilters): Promise<PointListResponse> {
    const {
      isActive,
      search,
      type,
      pageSize = 10,
      pageNumber = 1,
    } = filters;

    let query = Point.query();

    // Apply filters
    if (isActive !== undefined) {
      query = query.where('points.is_active', isActive);
    }

    if (search) {
      query = query.where('points.location_name', 'ilike', `%${search}%`);
    }

    if (type) {
      query = query.where('points.type', type);
    }

    // Count total records
    const countQuery = query.clone();
    const total = await countQuery.resultSize();

    // Apply pagination
    const offset = (pageNumber - 1) * pageSize;
    const points = await query
      .limit(pageSize)
      .offset(offset);

    return {
      points,
      totalPoints: total,
      totalPage: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      pageSize,
    };
  }

  /**
   * Get point by ID
   */
  async getPointById(id: string): Promise<Point> {
    const point = await Point.query().findById(id);

    if (!point) {
      throw new Error('Point not found');
    }

    return point;
  }

  /**
   * Create new point
   */
  async createPoint(data: {
    locationName: string;
    type: string;
    isActive?: boolean;
  }): Promise<Point> {
    // Check if point with same locationName and type already exists
    const existingPoint = await Point.query()
      .where('location_name', 'ilike', data.locationName)
      .where('type', data.type)
      .first();

    if (existingPoint) {
      throw new Error('Point with this location and type already exists');
    }

    const point = await Point.query().insert({
      locationName: data.locationName,
      type: data.type,
      isActive: data.isActive ?? true,
    });

    return point;
  }

  /**
   * Update point
   */
  async updatePoint(
    id: string,
    data: Partial<{
      locationName: string;
      type: string;
      isActive: boolean;
    }>
  ): Promise<Point> {
    const point = await Point.query().findById(id);

    if (!point) {
      throw new Error('Point not found');
    }

    // If updating locationName or type, check for duplicates
    if (data.locationName || data.type) {
      const locationName = data.locationName || point.locationName;
      const type = data.type || point.type;

      const existingPoint = await Point.query()
        .where('location_name', 'ilike', locationName)
        .where('type', type)
        .whereNot('id', id)
        .first();

      if (existingPoint) {
        throw new Error('Point with this location and type already exists');
      }
    }

    const updatedPoint = await Point.query()
      .patchAndFetchById(id, {
        ...(data.locationName && { locationName: data.locationName }),
        ...(data.type && { type: data.type }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      });

    return updatedPoint;
  }

  /**
   * Delete point
   */
  async deletePoint(id: string): Promise<void> {
    const point = await Point.query().findById(id);

    if (!point) {
      throw new Error('Point not found');
    }

    await Point.query().deleteById(id);
  }
}

export default new PointService();
