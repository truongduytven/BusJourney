import { Request, Response } from 'express'
import Trip from '../models/Trip'
import Bus from '../models/Bus'
import TypeBus from '../models/TypeBus'
import BusCompany from '../models/BusCompany'
import Review from '../models/Reviews'
import Coupon from '../models/Coupon'
import { IGetListTrip, ITripDetail } from '../types/trip.interface'
import { sendValidationError, sendNotFoundError, handleControllerError } from '../utils/responseHelper'
import { validateRequiredFields } from '../utils/validationHelper'

class TripController {
  async searchTrips(req: Request, res: Response) {
    try {
      const { pageNumber = 1, pageSize = 10, minPrice, maxPrice, sort = 'default' } = req.query

      const { fromCityId, toCityId, departureDate, typeBus, companiesId } = req.body

      const validation = validateRequiredFields(
        { fromCityId, toCityId, departureDate },
        ['fromCityId', 'toCityId', 'departureDate']
      );
      if (!validation.isValid) {
        return sendValidationError(res, 'fromCityId, toCityId và departureDate là bắt buộc');
      }
      const convertDate = new Date(departureDate as string)
      convertDate.setHours(convertDate.getHours() - 7, convertDate.getMinutes(), 0, 0)
      const lastDate = new Date(departureDate as string)
      lastDate.setHours(23, 59, 59, 999)
      const offset = (Number(pageNumber) - 1) * Number(pageSize)

      // Base query cho trips
      let tripQuery = Trip.query()
        .alias('t')
        .withGraphJoined('[buses.[bus_companies.[policies, cancellationRules], type_buses.[seat]], route.[startLocation, endLocation]]')
        .joinRelated('route.startLocation')
        .joinRelated('route.endLocation')
        .where('route:startLocation.city_id', fromCityId)
        .where('route:endLocation.city_id', toCityId)
        .where('t.status', 'scheduled') // Chỉ lấy trip có status là scheduled
        .whereRaw('t.departure_time >= ?', [convertDate])
        .whereRaw('t.departure_time <= ?', [lastDate])
        .select('t.*')
        .avg('review.rating as avgRating')
        .count('review.id as numberComments')
        .leftJoinRelated('review')
        .groupBy('t.id')
        .withGraphFetched('buses.bus_companies.coupons(activeCoupons)')
        .modifiers({
          activeCoupons(builder) {
            builder.where('status', 'active') // Chỉ lấy coupon có status là active
          }
        })

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
      res.status(200).json({
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
      return handleControllerError(res, err, 'searchTrips');
    }
  }

  async getTripById(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) {
        return sendValidationError(res, 'Trip ID is required');
      }
      const trip = (await Trip.query()
        .alias('t')
        .withGraphJoined(
          '[buses.[bus_companies.[policies, cancellationRules], type_buses.[seat]], route.[startLocation, endLocation], review.[account]]'
        )
        .where('t.id', id)
        .where('t.status', 'scheduled') // Chỉ lấy trip có status là scheduled
        .avg('review.rating as avgRating')
        .count('review.id as numberComments')
        .leftJoinRelated('review')
        .groupBy('t.id')
        .withGraphFetched('buses.bus_companies.coupons(activeCoupons)')
        .withGraphFetched('[point]')
        .modifiers({
          activeCoupons(builder) {
            builder.where('status', 'active').where('valid_to', '>=', new Date()).where('valid_from', '<=', new Date())
          }
        })
        .first()) as unknown as ITripDetail

      if (!trip) {
        return sendNotFoundError(res, 'Trip not found');
      }
      const TripResult = {
        tripId: id,
        coupons: trip.buses!.bus_companies.coupons.map((coupon) => ({
          id: coupon.id,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          description: coupon.description,
          validFrom: coupon.validFrom,
          validTo: coupon.validTo,
          maxDiscountValue: coupon.maxDiscountValue,
          status: coupon.status
        })),
        points: {
          startPoint: trip.point.filter((p) => p.type === 'pickup').map((p) => ({
            id: p.id,
            time: p.time,
            type: p.type,
            locationName: p.locationName
          })),
          endPoint: trip.point.filter((p) => p.type === 'dropoff').map((p) => ({
            id: p.id,
            time: p.time,
            type: p.type,
            locationName: p.locationName
          }))
        },
        rating: {
          average: trip.avgRating ? Number(trip.avgRating).toFixed(1) : 0,
          totalReviews: Number(trip.numberComments),
          countHaveDescription: trip.review.filter((r) => r.commenttext && r.commenttext.trim() !== '').length,
          countHaveImage: 0,
          typebus: trip.buses.type_buses.name,
          route: `${trip.route.startLocation.name} - ${trip.route.endLocation.name}`,
          list: trip.review.map((r) => ({
            ...r,
            account: {
              id: r.account.id,
              name: r.account.name,
              avatar: r.account.avatar
            }
          }))
        },
        companyPolicies: trip.buses!.bus_companies.policies!.filter((p) => p.isActive).map((p) => ({
          id: p.id,
          policyType: p.policyType,
          title: p.title,
          content: p.content,
        })),
        cancellationRules: trip.buses!.bus_companies.cancellationRules!.filter((r) => r.isActive).map((r) => ({
          id: r.id,
          timeBeforeDeparture: r.timeBeforeDeparture,
          refundPercentage: r.refundPercentage,
          feeAmount: r.feeAmount,
        })),
        images: trip.buses.images,
        extensions: trip.buses.extensions
      }

      res.json({
        message: 'Lấy chi tiết chuyến xe thành công',
        data: TripResult
      })
    } catch (err: any) {
      return handleControllerError(res, err, 'getTripById');
    }
  }

  async getTripSeatsById(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) {
        return sendValidationError(res, 'Trip ID is required');
      }
      const trip = (await Trip.query()
        .alias('t')
        .withGraphJoined('buses.[type_buses.[seat]]')
        .withGraphJoined('[ticket]')
        .withGraphFetched('[point]')
        .where('t.id', id)
        .where('t.status', 'scheduled') // Chỉ lấy trip có status là scheduled
        .first()) as unknown as IGetListTrip
      if (!trip) {
        return sendNotFoundError(res, 'Trip not found');
      }
      const tripResult = {
        tripId: trip.id,
        typeName: trip.buses.type_buses.name,
        price: trip.price,
        totalSeats: trip.buses.type_buses.totalSeats,
        numberCols: trip.buses.type_buses.numberCols,
        numberRows: trip.buses.type_buses.numberRows,
        isFloor: trip.buses.type_buses.isFloors,
        numberColsFloor: trip.buses.type_buses.numberColsFloor,
        numberRowsFloor: trip.buses.type_buses.numberRowsFloor,
        seats: trip.buses.type_buses.seat,
        bookedSeats: trip.ticket.filter((r) => r.status === 'valid').map((t) => t.seatCode),
        points: {
          startPoint: trip.point.filter((p) => p.type === 'pickup'),
          endPoint: trip.point.filter((p) => p.type === 'dropoff')
        }
      }
      res.json({
        message: 'Lấy danh sách ghế thành công',
        data: tripResult
      })
    } catch (err: any) {
      return handleControllerError(res, err, 'getTripSeatsById');
    }
  }
}

export default new TripController()
