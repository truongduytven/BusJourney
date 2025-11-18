import Trip from '../models/Trip'
import Template from '../models/Template'
import Bus from '../models/Bus'
import BusRoute from '../models/BusRoute'
import CompanyTrip from '../types/company-trip.interface'

export class CompanyTripService {
  static async listCompanyTrips(
    page: number,
    pageSize: number,
    search?: string,
    busId?: string,
    busRouteId?: string,
    templateId?: string,
    status?: boolean,
    startDate?: string,
    endDate?: string,
    companyId?: string
  ) {
    let query = Trip.query().withGraphFetched(
      '[busRoute.[route.[startLocation, endLocation]], buses.[type_buses], template, ticket]'
    )

    if (companyId) {
      query = query.where((builder) => {
        builder
          .whereExists(Trip.relatedQuery('buses').where('buses.company_id', companyId))
          .orWhereExists(Trip.relatedQuery('template').where('template.company_id', companyId))
      })
    }

    if (search) {
      query = query.where((builder) => {
        builder
          .whereExists(
            Trip.relatedQuery('busRoute')
              .joinRelated('route.[startLocation, endLocation]')
              .where((q) => {
                q.where('route:startLocation.name', 'ilike', `%${search}%`).orWhere(
                  'route:endLocation.name',
                  'ilike',
                  `%${search}%`
                )
              })
          )
          .orWhereExists(Trip.relatedQuery('template').where('templates.name', 'ilike', `%${search}%`))
      })
    }

    if (busId) {
      query = query.where('bus_id', busId)
    }

    if (busRouteId) {
      query = query.where('bus_routes_id', busRouteId)
    }

    if (templateId) {
      query = query.where('template_id', templateId)
    }

    if (status !== undefined) {
      query = query.where('status', status)
    }

    if (startDate) {
      query = query.where('departure_time', '>=', startDate)
    }

    if (endDate) {
      query = query.where('departure_time', '<=', `${endDate} 23:59:59`)
    }

    const total = await query.resultSize()
    const data = await query.orderBy('departure_time', 'desc').page(page - 1, pageSize)

    const tripsWithSeats = data.results.map((trip: any) => {
      const totalSeats = trip.buses?.type_buses?.totalSeats || 0
      const bookedSeats = trip.ticket?.filter((t: any) => t.status !== 'cancelled' && t.status !== 'refunded').length || 0
      const availableSeats = totalSeats - bookedSeats

      return {
        ...trip,
        totalSeats,
        bookedSeats,
        availableSeats
      }
    })

    return {
      data: tripsWithSeats,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  static async getTripById(id: string, companyId?: string) {
    const trip = (await Trip.query()
      .findById(id)
      .withGraphFetched('[busRoute.[route.[startLocation, endLocation]], buses.[type_buses], template, ticket]')) as any

    if (!trip) {
      throw new Error('Chuyến đi không tồn tại')
    }

    if (companyId) {
      const belongsToCompany =
        (trip.buses && (trip.buses as any).companyId === companyId) ||
        (trip.template && (trip.template as any).companyId === companyId)

      if (!belongsToCompany) {
        throw new Error('Không có quyền xem chuyến đi này')
      }
    }

    const totalSeats = trip.buses?.type_buses?.totalSeats || 0
    const bookedSeats = trip.ticket?.filter((t: any) => t.status !== 'cancelled' && t.status !== 'refunded').length || 0
    const availableSeats = totalSeats - bookedSeats

    return {
      ...trip,
      totalSeats,
      bookedSeats,
      availableSeats
    }
  }

  static async createTrip(data: {
    busRoutesId?: string
    templateId?: string
    busId?: string
    departureTime: Date | string
    arrivalTime: Date | string
    price: number
    status?: boolean
  }) {
    if (!data.busRoutesId && !data.templateId) {
      throw new Error('Phải chọn tuyến đường hoặc template')
    }

    if (data.templateId) {
      const template = await Template.query().findById(data.templateId)
      if (!template) {
        throw new Error('Template không tồn tại')
      }
      if (!template.is_active) {
        throw new Error('Template đã bị tạm dừng')
      }
    }

    if (data.busRoutesId) {
      const busRoute = await BusRoute.query().findById(data.busRoutesId)
      if (!busRoute) {
        throw new Error('Tuyến đường không tồn tại')
      }
      if (!busRoute.status) {
        throw new Error('Tuyến đường đã bị tạm dừng')
      }
    }

    if (data.busId) {
      const bus = await Bus.query().findById(data.busId)
      if (!bus) {
        throw new Error('Xe không tồn tại')
      }
    }

    const departureString = typeof data.departureTime === 'string' ? new Date(data.departureTime) : data.departureTime
    const arrivalString = typeof data.arrivalTime === 'string' ? new Date(data.arrivalTime) : data.arrivalTime

    if (departureString >= arrivalString) {
      throw new Error('Thời gian đến phải lớn hơn thời gian đi')
    }

    if (data.price <= 0) {
      throw new Error('Giá phải lớn hơn 0')
    }

    const trip = await Trip.query().insertAndFetch({
      busRoutesId: data.busRoutesId,
      templateId: data.templateId,
      busId: data.busId,
      departureTime: departureString,
      arrivalTime: arrivalString,
      price: data.price,
      status: data.status ?? true
    })

    return this.getTripById(trip.id)
  }

  static async createBulkTrips(data: {
    dates: string[]
    busRoutesId?: string
    templateId?: string
    busId: string
    departureTime: string
    arrivalTime: string
    price: number
    status?: boolean
  }) {
    if (!data.busRoutesId && !data.templateId) {
      throw new Error('Phải chọn tuyến đường hoặc template')
    }

    if (data.dates.length === 0) {
      throw new Error('Phải chọn ít nhất một ngày')
    }

    if (data.templateId) {
      const template = await Template.query().findById(data.templateId)
      if (!template) {
        throw new Error('Template không tồn tại')
      }
      if (!template.is_active) {
        throw new Error('Template đã bị tạm dừng')
      }
    }

    if (data.busRoutesId) {
      const busRoute = await BusRoute.query().findById(data.busRoutesId)
      if (!busRoute) {
        throw new Error('Tuyến đường không tồn tại')
      }
      if (!busRoute.status) {
        throw new Error('Tuyến đường đã bị tạm dừng')
      }
    }

    const bus = await Bus.query().findById(data.busId)
    if (!bus) {
      throw new Error('Xe không tồn tại')
    }

    const trips = data.dates.map((date) => {
      const departureDateTime = new Date(`${date}T${data.departureTime}`)
      const arrivalDateTime = new Date(`${date}T${data.arrivalTime}`)

      return {
        bus_routes_id: data.busRoutesId,
        template_id: data.templateId,
        bus_id: data.busId,
        departure_time: departureDateTime,
        arrival_time: arrivalDateTime,
        price: data.price,
        status: data.status ?? true
      }
    })

    const createdTrips = await Trip.query().insert(trips)

    return {
      message: `Tạo thành công ${Array.isArray(createdTrips) ? createdTrips.length : 1} chuyến đi`,
      count: Array.isArray(createdTrips) ? createdTrips.length : 1
    }
  }

  static async updateTrip(
    id: string,
    data: {
      busRoutesId?: string
      templateId?: string
      busId?: string
      departureTime?: Date | string
      arrivalTime?: Date | string
      price?: number
      status?: boolean
    },
    companyId?: string
  ) {
    const trip = await Trip.query().findById(id).withGraphFetched('[buses, template]') as any;

    if (!trip) {
      throw new Error('Chuyến đi không tồn tại')
    }

    if (companyId) {
      const belongsToCompany =
        (trip.buses && (trip.buses as any).companyId === companyId) ||
        (trip.template && (trip.template as any).companyId === companyId)

      if (!belongsToCompany) {
        throw new Error('Không có quyền cập nhật chuyến đi này')
      }
    }

    const updateData: any = {}
    if (data.busRoutesId !== undefined) updateData.bus_routes_id = data.busRoutesId
    if (data.templateId !== undefined) updateData.template_id = data.templateId
    if (data.busId !== undefined) updateData.bus_id = data.busId
    if (data.departureTime !== undefined) updateData.departure_time = new Date(data.departureTime)
    if (data.arrivalTime !== undefined) updateData.arrival_time = new Date(data.arrivalTime)
    if (data.price !== undefined) updateData.price = data.price
    if (data.status !== undefined) updateData.status = data.status

    await Trip.query().patchAndFetchById(id, updateData)

    return this.getTripById(id)
  }

  static async toggleTripStatus(id: string, status: boolean, companyId?: string) {
    const trip = await Trip.query().findById(id).withGraphFetched('[buses, template]') as any

    if (!trip) {
      throw new Error('Chuyến đi không tồn tại')
    }

    if (companyId) {
      const belongsToCompany =
        (trip.buses && (trip.buses as any).companyId === companyId) ||
        (trip.template && (trip.template as any).companyId === companyId)

      if (!belongsToCompany) {
        throw new Error('Không có quyền cập nhật chuyến đi này')
      }
    }

    await Trip.query().patchAndFetchById(id, { status })

    return { message: `${status ? 'Kích hoạt' : 'Tạm dừng'} chuyến đi thành công` }
  }

  static async bulkToggleTripStatus(ids: string[], status: boolean, companyId?: string) {
    if (companyId) {
      const trips = await Trip.query().findByIds(ids).withGraphFetched('[buses, template]') as any

      const unauthorizedTrips = trips.filter((trip: any) => {
        const belongsToCompany =
          (trip.buses && (trip.buses as any).companyId === companyId) ||
          (trip.template && (trip.template as any).companyId === companyId)
        return !belongsToCompany
      })

      if (unauthorizedTrips.length > 0) {
        throw new Error('Không có quyền cập nhật một số chuyến đi')
      }
    }

    await Trip.query().patch({ status }).whereIn('id', ids)

    return { message: `${status ? 'Kích hoạt' : 'Tạm dừng'} ${ids.length} chuyến đi thành công` }
  }
}
