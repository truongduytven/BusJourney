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
}

export default new CityService()
