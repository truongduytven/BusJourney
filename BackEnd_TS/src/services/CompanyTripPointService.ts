import TripPoint from '../models/TripPoint'
import Point from '../models/Point'
import Trip from '../models/Trip'

export class CompanyTripPointService {
  static async listCompanyTripPoints(
    page: number,
    pageSize: number,
    search?: string,
    tripId?: string,
    pointId?: string,
    type?: string,
    isActive?: boolean,
    companyId?: string
  ) {
    let query = TripPoint.query()
      .withGraphFetched('[trip.[busRoute.[route.[startLocation, endLocation]], template], point]')

    if (companyId) {
      query = query.whereExists(
        TripPoint.relatedQuery('trip').where((builder) => {
          builder
            .whereExists(
              Trip.relatedQuery('buses').where('buses.company_id', companyId)
            )
            .orWhereExists(
              Trip.relatedQuery('template').where('template.company_id', companyId)
            )
        })
      )
    }

    if (search) {
      query = query.whereExists(
        TripPoint.relatedQuery('point').where('points.location_name', 'ilike', `%${search}%`)
      )
    }

    if (tripId) {
      query = query.where('trip_id', tripId)
    }

    if (pointId) {
      query = query.where('point_id', pointId)
    }

    if (type) {
      query = query.whereExists(
        TripPoint.relatedQuery('point').where('points.type', type)
      )
    }

    if (isActive !== undefined) {
      query = query.where('trip_points.is_active', isActive)
    }

    const total = await query.resultSize()
    const data = await query
      .orderBy('time', 'asc')
      .page(page - 1, pageSize)

    return {
      data: data.results,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  static async getTripPointById(id: string, companyId?: string) {
    const tripPoint = (await TripPoint.query()
      .findById(id)
      .withGraphFetched('[trip.[busRoute.[route.[startLocation, endLocation]], template, buses], point]')) as any

    if (!tripPoint) {
      throw new Error('Điểm đón/trả không tồn tại')
    }

    if (companyId && tripPoint.trip) {
      const belongsToCompany =
        (tripPoint.trip.buses && (tripPoint.trip.buses as any).companyId === companyId) ||
        (tripPoint.trip.template && (tripPoint.trip.template as any).companyId === companyId)

      if (!belongsToCompany) {
        throw new Error('Không có quyền xem điểm đón/trả này')
      }
    }

    return tripPoint
  }

  static async createTripPoint(data: {
    tripId: string
    pointId?: string
    pointData?: {
      type: string
      locationName: string
    }
    time: Date | string
    isActive?: boolean
  }, companyId?: string) {
    const trip = await Trip.query()
      .findById(data.tripId)
      .withGraphFetched('[buses, template]') as any

    if (!trip) {
      throw new Error('Chuyến đi không tồn tại')
    }

    if (companyId) {
      const belongsToCompany =
        (trip.buses && (trip.buses as any).companyId === companyId) ||
        (trip.template && (trip.template as any).companyId === companyId)

      if (!belongsToCompany) {
        throw new Error('Không có quyền thêm điểm đón/trả cho chuyến đi này')
      }
    }

    let pointId = data.pointId

    if (!pointId && data.pointData) {
      const newPoint = await Point.query().insert({
        type: data.pointData.type,
        locationName: data.pointData.locationName,
        isActive: true
      })
      pointId = newPoint.id
    }

    if (!pointId) {
      throw new Error('Phải cung cấp pointId hoặc pointData')
    }

    const point = await Point.query().findById(pointId)
    if (!point) {
      throw new Error('Điểm đón/trả không tồn tại')
    }

    const timeDate = typeof data.time === 'string' ? new Date(data.time) : data.time

    const tripPoint = await TripPoint.query().insertAndFetch({
      tripId: data.tripId,
      pointId: pointId,
      time: timeDate,
      isActive: data.isActive ?? true
    })

    return this.getTripPointById(tripPoint.id)
  }

  static async updateTripPoint(
    id: string,
    data: {
      tripId?: string
      pointId?: string
      time?: Date | string
      isActive?: boolean
    },
    companyId?: string
  ) {
    const tripPoint = await TripPoint.query()
      .findById(id)
      .withGraphFetched('[trip.[buses, template]]') as any

    if (!tripPoint) {
      throw new Error('Điểm đón/trả không tồn tại')
    }

    if (companyId && tripPoint.trip) {
      const belongsToCompany =
        (tripPoint.trip.buses && (tripPoint.trip.buses as any).companyId === companyId) ||
        (tripPoint.trip.template && (tripPoint.trip.template as any).companyId === companyId)

      if (!belongsToCompany) {
        throw new Error('Không có quyền cập nhật điểm đón/trả này')
      }
    }

    const updateData: any = {}
    if (data.tripId !== undefined) updateData.trip_id = data.tripId
    if (data.pointId !== undefined) updateData.point_id = data.pointId
    if (data.time !== undefined) updateData.time = new Date(data.time)
    if (data.isActive !== undefined) updateData.is_active = data.isActive

    await TripPoint.query().patchAndFetchById(id, updateData)

    return this.getTripPointById(id)
  }

  static async deleteTripPoint(id: string, companyId?: string) {
    const tripPoint = await TripPoint.query()
      .findById(id)
      .withGraphFetched('[trip.[buses, template]]') as any

    if (!tripPoint) {
      throw new Error('Điểm đón/trả không tồn tại')
    }

    if (companyId && tripPoint.trip) {
      const belongsToCompany =
        (tripPoint.trip.buses && (tripPoint.trip.buses as any).companyId === companyId) ||
        (tripPoint.trip.template && (tripPoint.trip.template as any).companyId === companyId)

      if (!belongsToCompany) {
        throw new Error('Không có quyền xóa điểm đón/trả này')
      }
    }

    await TripPoint.query().deleteById(id)

    return { message: 'Xóa điểm đón/trả thành công' }
  }

  static async toggleTripPointStatus(id: string, isActive: boolean, companyId?: string) {
    const tripPoint = await TripPoint.query()
      .findById(id)
      .withGraphFetched('[trip.[buses, template]]') as any

    if (!tripPoint) {
      throw new Error('Điểm đón/trả không tồn tại')
    }

    if (companyId && tripPoint.trip) {
      const belongsToCompany =
        (tripPoint.trip.buses && (tripPoint.trip.buses as any).companyId === companyId) ||
        (tripPoint.trip.template && (tripPoint.trip.template as any).companyId === companyId)

      if (!belongsToCompany) {
        throw new Error('Không có quyền cập nhật điểm đón/trả này')
      }
    }

    await TripPoint.query().patchAndFetchById(id, { isActive })

    return { message: `${isActive ? 'Kích hoạt' : 'Tạm dừng'} điểm đón/trả thành công` }
  }
}
