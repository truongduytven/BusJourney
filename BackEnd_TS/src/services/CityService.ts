import City from '../models/City'

class CityService {
  async getAllCities() {
    try {
      const cities = await City.query()
      return {
        success: true,
        data: cities
      }
    } catch (error) {
      throw error
    }
  }

  async getListCities(params: {
    search?: string;
    isActive?: boolean;
    pageNumber: number;
    pageSize: number;
  }) {
    const { search, isActive, pageNumber, pageSize } = params;

    let query = City.query();

    // Filter by active status
    if (isActive !== undefined) {
      query = query.where('is_active', isActive);
    }

    // Search by name
    if (search) {
      query = query.where('name', 'ilike', `%${search}%`);
    }

    // Get total count
    const totalCities = await query.resultSize();

    // Pagination
    const offset = (pageNumber - 1) * pageSize;
    const cities = await query
      .limit(pageSize)
      .offset(offset)
      .orderBy('name', 'asc');

    const totalPage = Math.ceil(totalCities / pageSize);

    return {
      cities,
      totalPage,
      currentPage: pageNumber,
      pageSize,
      totalCities
    };
  }

  async getCityById(id: string) {
    const city = await City.query().findById(id);
    
    if (!city) {
      throw new Error('City not found');
    }

    return city;
  }

  async createCity(data: {
    name: string;
    isActive?: boolean;
  }) {
    // Check if city name already exists
    const existingCity = await City.query().findOne({ name: data.name });
    
    if (existingCity) {
      throw new Error('City name already exists');
    }

    const newCity = await City.query()
      .insert({
        name: data.name,
        isActive: data.isActive ?? true
      })
      .returning('*');

    return newCity;
  }

  async updateCity(id: string, data: {
    name?: string;
    isActive?: boolean;
  }) {
    const city = await City.query().findById(id);
    
    if (!city) {
      throw new Error('City not found');
    }

    // If name is being updated, check if it already exists
    if (data.name && data.name !== city.name) {
      const existingCity = await City.query().findOne({ name: data.name });
      if (existingCity) {
        throw new Error('City name already exists');
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    const updatedCity = await City.query()
      .patchAndFetchById(id, updateData);

    return updatedCity;
  }

  async deleteCity(id: string) {
    const city = await City.query().findById(id);
    
    if (!city) {
      throw new Error('City not found');
    }

    await City.query().deleteById(id);
    
    return { message: 'City deleted successfully' };
  }
}

export default new CityService()
