import Trip from '../models/Trip'
import TypeBus from '../models/TypeBus'
import BusCompany from '../models/BusCompany'
import { IGetListTrip, ITripDetail } from '../types/trip.interface'
import moment from 'moment'

interface SearchTripsParams {
  pageNumber?: number
  pageSize?: number
  minPrice?: number
  maxPrice?: number
  sort?: string
  fromCityId: string
  toCityId: string
  departureDate: string
  typeBus?: string[]
  companiesId?: string[]
}

class TripService {
  async searchTrips(params: SearchTripsParams) {
    const {
      pageNumber = 1,
      pageSize = 10,
      minPrice,
      maxPrice,
      sort = 'default',
      fromCityId,
      toCityId,
      departureDate,
      typeBus,
      companiesId
    } = params

    const startOfDay = moment(departureDate).startOf('day').toDate()
    const endOfDay = moment(departureDate).endOf('day').toDate()

    // const offset = (Number(pageNumber) - 1) * Number(pageSize)

    // // Base query cho trips
    // let tripQuery = Trip.query()
    //   .alias('t')
    //   .withGraphJoined(
    //     '[buses.[bus_companies.[policies, cancellationRules], type_buses.[seat]], busRoute.route.[startLocation, endLocation]]'
    //   )
    //   .joinRelated('busRoute.route.startLocation')
    //   .joinRelated('busRoute.route.endLocation')
    //   .where('busRoute:route:startLocation.city_id', fromCityId)
    //   .where('busRoute:route:endLocation.city_id', toCityId)
    //   .where('t.status', true)
    //   .whereRaw('t.departure_time >= ?', [startOfDay])
    //   .whereRaw('t.departure_time <= ?', [endOfDay])
    //   .select('t.*')
    //   .avg('review.rating as avgRating')
    //   .count('review.id as numberComments')
    //   .leftJoinRelated('review')
    //   .groupBy('t.id')
    //   .withGraphFetched('buses.bus_companies.coupons(activeCoupons)')
    //   .modifiers({
    //     activeCoupons(builder) {
    //       builder.where('status', 'active')
    //     }
    //   })

    // // Filters
    // if (companiesId && companiesId.length > 0) {
    //   tripQuery = tripQuery.joinRelated('buses').whereIn('buses.company_id', companiesId)
    // }
    // if (typeBus && typeBus.length > 0) {
    //   tripQuery = tripQuery.joinRelated('buses').whereIn('buses.type_bus_id', typeBus)
    // }
    // if (minPrice) {
    //   tripQuery = tripQuery.where('t.price', '>=', Number(minPrice))
    // }
    // if (maxPrice) {
    //   tripQuery = tripQuery.where('t.price', '<=', Number(maxPrice))
    // }

    // // Sorting
    // switch (sort) {
    //   case 'price_asc':
    //     tripQuery = tripQuery.orderBy('t.price', 'asc')
    //     break
    //   case 'price_desc':
    //     tripQuery = tripQuery.orderBy('t.price', 'desc')
    //     break
    //   case 'early':
    //     tripQuery = tripQuery.orderBy('t.departure_time', 'asc')
    //     break
    //   case 'late':
    //     tripQuery = tripQuery.orderBy('t.departure_time', 'desc')
    //     break
    //   case 'high_rate':
    //     tripQuery = tripQuery.orderBy('avgRating', 'desc')
    //     break
    //   case 'low_rate':
    //     tripQuery = tripQuery.orderBy('avgRating', 'asc')
    //     break
    //   default:
    //     tripQuery = tripQuery.orderBy('t.departure_time', 'asc')
    // }

    // // Pagination
    // const [trips, total] = await Promise.all([
    //   tripQuery.clone().limit(Number(pageSize)).offset(offset),
    //   tripQuery.clone().resultSize()
    // ])

    // // Lấy danh sách loại bus
    // const listBus = await TypeBus.query()
    //   .select('type_buses.id', 'type_buses.name')
    //   .count('buses:trips.id as quantity')
    //   .joinRelated('buses.trips')
    //   .whereIn(
    //     'buses:trips.id',
    //     trips.map((t) => t.id)
    //   )
    //   .groupBy('type_buses.id')

    // // Lấy danh sách công ty
    // const listCompany = await BusCompany.query()
    //   .select('bus_companies.id', 'bus_companies.name')
    //   .count('buses:trips.id as quantity')
    //   .joinRelated('buses.trips')
    //   .whereIn(
    //     'buses:trips.id',
    //     trips.map((t) => t.id)
    //   )
    //   .groupBy('bus_companies.id')

    return {
      // success: true,
      // page: Number(pageNumber),
      // pageSize: Number(pageSize),
      // totalItems: total,
      // totalPages: Math.ceil(total / Number(pageSize)),
      // listBus,
      // listCompany,
      // data: trips
      startDate: startOfDay,
      endDate: endOfDay
    }
  }

  async getTripById(tripId: string) {
    const trip = (await Trip.query()
      .alias('t')
      .withGraphJoined(
        '[buses.[bus_companies.[policies, cancellationRules], type_buses.[seat]], busRoute.route.[startLocation, endLocation], review.[account]]'
      )
      .where('t.id', tripId)
      .where('t.status', true)
      .avg('review.rating as avgRating')
      .count('review.id as numberComments')
      .leftJoinRelated('review')
      .groupBy('t.id')
      .withGraphFetched('buses.bus_companies.coupons(activeCoupons)')
      .withGraphFetched('[tripPoints.point]')
      .modifiers({
        activeCoupons(builder) {
          builder.where('status', 'active').where('valid_to', '>=', new Date()).where('valid_from', '<=', new Date())
        }
      })
      .first()) as unknown as ITripDetail

    if (!trip) {
      return null
    }

    return {
      tripId,
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
        startPoint: trip.tripPoints
          .filter((tp) => tp.point.type === 'pickup')
          .map((tp) => ({
            id: tp.point.id,
            time: tp.time,
            type: tp.point.type,
            locationName: tp.point.locationName
          })),
        endPoint: trip.tripPoints
          .filter((tp) => tp.point.type === 'dropoff')
          .map((tp) => ({
            id: tp.point.id,
            time: tp.time,
            type: tp.point.type,
            locationName: tp.point.locationName
          }))
      },
      rating: {
        average: trip.avgRating ? Number(trip.avgRating).toFixed(1) : 0,
        totalReviews: Number(trip.numberComments),
        countHaveDescription: trip.review.filter((r) => r.commenttext && r.commenttext.trim() !== '').length,
        countHaveImage: 0,
        typebus: trip.buses.type_buses.name,
        route: `${trip.busRoute.route.startLocation.name} - ${trip.busRoute.route.endLocation.name}`,
        list: trip.review.map((r) => ({
          ...r,
          account: {
            id: r.account.id,
            name: r.account.name,
            avatar: r.account.avatar
          }
        }))
      },
      companyPolicies: trip
        .buses!.bus_companies.policies!.filter((p) => p.isActive)
        .map((p) => ({
          id: p.id,
          policyType: p.policyType,
          title: p.title,
          content: p.content
        })),
      cancellationRules: trip
        .buses!.bus_companies.cancellationRules!.filter((r) => r.isActive)
        .map((r) => ({
          id: r.id,
          timeBeforeDeparture: r.timeBeforeDeparture,
          refundPercentage: r.refundPercentage,
          feeAmount: r.feeAmount
        })),
      images: trip.buses.images,
      extensions: trip.buses.extensions
    }
  }

  async getTripCoupons(tripId: string) {
    const trip = (await Trip.query()
      .alias('t')
      .withGraphFetched('buses.bus_companies.coupons(activeCoupons)')
      .modifiers({
        activeCoupons(builder) {
          builder.where('status', 'active').where('valid_to', '>=', new Date()).where('valid_from', '<=', new Date())
        }
      })
      .where('t.id', tripId)
      .where('t.status', true)
      .first()) as unknown as ITripDetail

    if (!trip) {
      return null
    }

    return {
      tripId,
      coupons: trip.buses!.bus_companies.coupons.map((coupon) => ({
        id: coupon.id,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description,
        validFrom: coupon.validFrom,
        validTo: coupon.validTo,
        maxDiscountValue: coupon.maxDiscountValue,
        status: coupon.status
      }))
    }
  }

  async getTripPoints(tripId: string) {
    const trip = (await Trip.query()
      .alias('t')
      .withGraphFetched('[tripPoints.point]')
      .where('t.id', tripId)
      .where('t.status', true)
      .first()) as unknown as ITripDetail

    if (!trip) {
      return null
    }

    return {
      tripId,
      points: {
        startPoint: trip.tripPoints
          .filter((tp) => tp.point.type === 'pickup')
          .map((tp) => ({
            id: tp.point.id,
            time: tp.time,
            type: tp.point.type,
            locationName: tp.point.locationName
          })),
        endPoint: trip.tripPoints
          .filter((tp) => tp.point.type === 'dropoff')
          .map((tp) => ({
            id: tp.point.id,
            time: tp.time,
            type: tp.point.type,
            locationName: tp.point.locationName
          }))
      }
    }
  }

  async getTripRatings(
    tripId: string,
    params?: {
      page?: number
      pageSize?: number
      filterType?: 'all' | 'withComment' | 'withImage'
      starRatings?: number[]
    }
  ) {
    const { page = 1, pageSize = 5, filterType = 'all', starRatings = [] } = params || {}

    // Get overall statistics
    const rating = (await Trip.query()
      .alias('t')
      .leftJoinRelated('review')
      .where('t.id', tripId)
      .where('t.status', true)
      .avg('review.rating as avgRating')
      .count('review.id as numberComments')
      .first()) as any

    if (!rating) return null

    // Get trip info
    const trip = (await Trip.query()
      .alias('t')
      .withGraphFetched('[buses.type_buses, busRoute.route.[startLocation, endLocation]]')
      .where('t.id', tripId)
      .first()) as any

    // Build query for reviews with filters
    let reviewQuery = Trip.query()
      .alias('t')
      .withGraphFetched('[review.[account]]')
      .where('t.id', tripId)
      .where('t.status', true)
      .first() as any

    const allReviews = await reviewQuery
    let filteredReviews = allReviews?.review || []

    // Apply filters
    if (filterType === 'withComment') {
      filteredReviews = filteredReviews.filter((r: any) => r.commenttext?.trim())
    } else if (filterType === 'withImage') {
      filteredReviews = filteredReviews.filter((r: any) => r.images && r.images.length > 0)
    }

    // Filter by star ratings
    if (starRatings.length > 0) {
      filteredReviews = filteredReviews.filter((r: any) => starRatings.includes(r.rating))
    }

    // Calculate pagination
    const totalFiltered = filteredReviews.length
    const totalPages = Math.ceil(totalFiltered / pageSize)
    const offset = (page - 1) * pageSize
    const paginatedReviews = filteredReviews.slice(offset, offset + pageSize)

    return {
      tripId,
      rating: {
        average: rating.avgRating ? Number(rating.avgRating).toFixed(1) : 0,
        totalReviews: Number(rating.numberComments),
        countHaveDescription: allReviews?.review.filter((r: any) => r.commenttext?.trim()).length || 0,
        countHaveImage: allReviews?.review.filter((r: any) => r.images && r.images.length > 0).length || 0,
        typebus: trip.buses.type_buses.name,
        route: `${trip.busRoute.route.startLocation.name} - ${trip.busRoute.route.endLocation.name}`,
        list: paginatedReviews.map((r: any) => ({
          ...r,
          account: {
            id: r.account.id,
            name: r.account.name,
            avatar: r.account.avatar
          }
        })),
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: totalFiltered,
          totalPages
        }
      }
    }
  }

  async getTripPolicies(tripId: string) {
    const trip = (await Trip.query()
      .alias('t')
      .withGraphJoined('[buses.bus_companies.[policies, cancellationRules]]')
      .where('t.id', tripId)
      .where('t.status', true)
      .first()) as unknown as ITripDetail

    if (!trip) {
      return null
    }

    return {
      tripId,
      companyPolicies: trip
        .buses!.bus_companies.policies!.filter((p) => p.isActive)
        .map((p) => ({
          id: p.id,
          policyType: p.policyType,
          title: p.title,
          content: p.content
        })),
      cancellationRules: trip
        .buses!.bus_companies.cancellationRules!.filter((r) => r.isActive)
        .map((r) => ({
          id: r.id,
          timeBeforeDeparture: r.timeBeforeDeparture,
          refundPercentage: r.refundPercentage,
          feeAmount: r.feeAmount
        }))
    }
  }

  async getTripImages(tripId: string) {
    const trip = (await Trip.query()
      .alias('t')
      .withGraphJoined('[buses]')
      .where('t.id', tripId)
      .where('t.status', true)
      .first()) as unknown as ITripDetail

    if (!trip) {
      return null
    }

    return {
      tripId,
      images: trip.buses.images
    }
  }

  async getTripExtensions(tripId: string) {
    const trip = (await Trip.query()
      .alias('t')
      .withGraphJoined('[buses]')
      .where('t.id', tripId)
      .where('t.status', true)
      .first()) as unknown as ITripDetail

    if (!trip) {
      return null
    }

    return {
      tripId,
      extensions: trip.buses.extensions
    }
  }

  async getTripSeatsById(tripId: string) {
    const trip = (await Trip.query()
      .alias('t')
      .withGraphJoined('buses.[type_buses.[seat]]')
      .withGraphJoined('[ticket]')
      .withGraphFetched('[tripPoints.point]')
      .where('t.id', tripId)
      .where('t.status', true)
      .first()) as unknown as IGetListTrip

    if (!trip) {
      return null
    }

    return {
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
        startPoint: trip.tripPoints
          .filter((tp) => tp.point.type === 'pickup')
          .map((tp) => ({
            id: tp.point.id,
            time: tp.time,
            type: tp.point.type,
            locationName: tp.point.locationName
          })),
        endPoint: trip.tripPoints
          .filter((tp) => tp.point.type === 'dropoff')
          .map((tp) => ({
            id: tp.point.id,
            time: tp.time,
            type: tp.point.type,
            locationName: tp.point.locationName
          }))
      }
    }
  }
}

export default new TripService()
