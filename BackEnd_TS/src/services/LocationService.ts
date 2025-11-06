import Location from '../models/Location';

interface LocationListFilters {
  isActive?: boolean;
  search?: string;
  cityId?: string;
  pageSize?: number;
  pageNumber?: number;
}

interface LocationListResponse {
  locations: Location[];
  totalLocations: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}

class LocationService {
  /**
   * Get paginated list of locations with filters
   */
  async getListLocations(filters: LocationListFilters): Promise<LocationListResponse> {
    const {
      isActive,
      search,
      cityId,
      pageSize = 10,
      pageNumber = 1,
    } = filters;

    let query = Location.query().withGraphFetched('city');

    // Apply filters
    if (isActive !== undefined) {
      query = query.where('locations.is_active', isActive);
    }

    if (search) {
      query = query.where('locations.name', 'ilike', `%${search}%`);
    }

    if (cityId) {
      query = query.where('locations.city_id', cityId);
    }

    // Count total records
    const countQuery = query.clone();
    const total = await countQuery.resultSize();

    // Apply pagination
    const offset = (pageNumber - 1) * pageSize;
    const locations = await query
      .limit(pageSize)
      .offset(offset)

    return {
      locations,
      totalLocations: total,
      totalPage: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      pageSize,
    };
  }

  /**
   * Get location by ID
   */
  async getLocationById(id: string): Promise<Location> {
    const location = await Location.query()
      .findById(id)
      .withGraphFetched('city');

    if (!location) {
      throw new Error('Location not found');
    }

    return location;
  }

  /**
   * Create new location
   */
  async createLocation(data: {
    name: string;
    cityId: string;
    isActive?: boolean;
  }): Promise<Location> {
    // Check if location name already exists in the same city
    const existingLocation = await Location.query()
      .where('name', 'ilike', data.name)
      .where('city_id', data.cityId)
      .first();

    if (existingLocation) {
      throw new Error('Location with this name already exists in this city');
    }

    const location = await Location.query().insert({
      name: data.name,
      cityId: data.cityId,
      isActive: data.isActive ?? true,
    });

    return location;
  }

  /**
   * Update location
   */
  async updateLocation(
    id: string,
    data: Partial<{
      name: string;
      cityId: string;
      isActive: boolean;
    }>
  ): Promise<Location> {
    const location = await Location.query().findById(id);

    if (!location) {
      throw new Error('Location not found');
    }

    // If updating name, check for duplicates in the same city
    if (data.name) {
      const cityId = data.cityId || location.cityId;
      const existingLocation = await Location.query()
        .where('name', 'ilike', data.name)
        .where('city_id', cityId)
        .whereNot('id', id)
        .first();

      if (existingLocation) {
        throw new Error('Location with this name already exists in this city');
      }
    }

    const updatedLocation = await Location.query()
      .patchAndFetchById(id, {
        ...(data.name && { name: data.name }),
        ...(data.cityId && { cityId: data.cityId }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      });

    return updatedLocation;
  }

  /**
   * Delete location
   */
  async deleteLocation(id: string): Promise<void> {
    const location = await Location.query().findById(id);

    if (!location) {
      throw new Error('Location not found');
    }

    await Location.query().deleteById(id);
  }
}

export default new LocationService();
