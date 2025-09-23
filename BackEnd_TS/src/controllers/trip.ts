import { Request, Response } from 'express'
import Trip from '../models/Trip'
import Bus from '../models/Bus'
import TypeBus from '../models/TypeBus'
import BusCompany from '../models/BusCompany'
import Review from '../models/Reviews'
import Coupon from '../models/Coupon'

class TripController {
  async searchTrips(req: Request, res: Response) {
    try {
      const { pageNumber = 1, pageSize = 10, minPrice, maxPrice, sort = 'default' } = req.query

      const { fromCityId, toCityId, departureDate, typeBus, companiesId } = req.body

      if (!fromCityId || !toCityId || !departureDate) {
        return res.status(400).json({
          message: 'fromCityId, toCityId và departureDate là bắt buộc'
        })
      }
      const convertDate = new Date(departureDate as string)
      convertDate.setHours(convertDate.getHours() - 7, convertDate.getMinutes(), 0, 0)

      const offset = (Number(pageNumber) - 1) * Number(pageSize)

      // Base query cho trips
      let tripQuery = Trip.query()
        .alias('t')
        .withGraphJoined('[buses.[bus_companies, type_buses.[seat]], route.[startLocation, endLocation]]')
        .joinRelated('route.startLocation')
        .joinRelated('route.endLocation')
        .where('route:startLocation.city_id', fromCityId)
        .where('route:endLocation.city_id', toCityId)
        .whereRaw('t.departure_time >= ?', [convertDate])
        .select('t.*')
        .avg('review.rating as avgRating')
        .count('review.id as numberComments')
        .leftJoinRelated('review')
        .groupBy('t.id')
        .withGraphFetched('buses.bus_companies.coupons')

      // Filters
      if (companiesId && companiesId.length > 0) {
        tripQuery = tripQuery.joinRelated('buses').whereIn('buses.company_id', companiesId)
      }
      if (typeBus && typeBus.length > 0) {
        tripQuery = tripQuery.joinRelated('buses').whereIn('buses.type_bus_id', typeBus)
      }
      if (minPrice) {
        tripQuery = tripQuery.where('t.price', '>=', Number(minPrice))
      }
      if (maxPrice) {
        tripQuery = tripQuery.where('t.price', '<=', Number(maxPrice))
      }
      // Sorting
      switch (sort) {
        case 'price_asc':
          tripQuery = tripQuery.orderBy('t.price', 'asc')
          break
        case 'price_desc':
          tripQuery = tripQuery.orderBy('t.price', 'desc')
          break
        case 'early':
          tripQuery = tripQuery.orderBy('t.departure_time', 'asc')
          break
        case 'late':
          tripQuery = tripQuery.orderBy('t.departure_time', 'desc')
          break
        case 'high_rate':
          tripQuery = tripQuery.orderBy('avgRating', 'desc')
          break
        case 'low_rate':
          tripQuery = tripQuery.orderBy('avgRating', 'asc')
          break
        default:
          tripQuery = tripQuery.orderBy('t.departure_time', 'asc')
      }
      // Pagination
      const [trips, total] = await Promise.all([
        tripQuery.clone().limit(Number(pageSize)).offset(offset),
        tripQuery.clone().resultSize()
      ])
      // Lấy danh sách loại bus
      const listBus = await TypeBus.query()
        .select('type_buses.id', 'type_buses.name')
        .count('buses:trips.id as quantity')
        .joinRelated('buses.trips')
        .whereIn(
          'buses:trips.id',
          trips.map((t) => t.id)
        )
        .groupBy('type_buses.id')
      // Lấy danh sách công ty
      const listCompany = await BusCompany.query()
        .select('bus_companies.id', 'bus_companies.name')
        .count('buses:trips.id as quantity')
        .joinRelated('buses.trips')
        .whereIn(
          'buses:trips.id',
          trips.map((t) => t.id)
        )
        .groupBy('bus_companies.id')
      res.json({
        message: 'Danh sách chuyến xe',
        page: Number(pageNumber),
        pageSize: Number(pageSize),
        totalItems: total,
        totalPages: Math.ceil(total / Number(pageSize)),
        listBus,
        listCompany,
        data: trips
      })
    } catch (err: any) {
      console.error(err)
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }

  async getTripById(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({
          message: 'Trip ID is required'
        })
      }
      const trip = await Trip.query().findById(id)
      if (!trip) {
        return res.status(404).json({
          message: 'Trip not found'
        })
      }
      res.json({
        message: 'Trip details',
        data: trip
      })
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }
}

export default new TripController()
