import Ticket from '../models/Ticket'

// Type definitions for relations
interface TicketWithRelations extends Ticket {
  account?: any
  order?: any
  trip?: any
  pickUpPoint?: any
  dropOffPoint?: any
}
export interface TicketLookupRequest {
  email: string
  phone: string
  ticketCode: string
}

interface TicketListFilters {
  search?: string
  status?: string
  userId?: string
  tripId?: string
  orderId?: string
  pageSize?: number
  pageNumber?: number
  companyId?: string
}
interface TicketListResponse {
  tickets: Ticket[]
  totalTickets: number
  totalPage: number
  currentPage: number
  pageSize: number
}

class TicketService {
  async getListTickets(filters: TicketListFilters): Promise<TicketListResponse> {
    const { search, status, userId, tripId, orderId, pageSize = 10, pageNumber = 1, companyId } = filters

    let query = Ticket.query().withGraphFetched(
      '[account, order, trip.[busRoute.[route.[startLocation, endLocation]], template, buses.bus_companies], pickUpPoint, dropOffPoint]'
    )

    // Apply company filter if provided - need to join tables for WHERE clause
    if (companyId) {
      query = query
        .joinRelated('trip.buses')
        .where('trip:buses.company_id', companyId)
    }
    
    if (status) {
      query = query.where('tickets.status', status)
    }

    if (userId) {
      query = query.where('tickets.user_id', userId)
    }

    if (tripId) {
      query = query.where('tickets.trip_id', tripId)
    }

    if (orderId) {
      query = query.where('tickets.order_id', orderId)
    }

    if (search) {
      query = query.where((builder) => {
        builder
          .where('tickets.ticket_code', 'ilike', `%${search}%`)
          .orWhere('tickets.seat_code', 'ilike', `%${search}%`)
      })
    }

    const countQuery = query.clone()
    const total = await countQuery.resultSize()

    const offset = (pageNumber - 1) * pageSize
    const tickets = await query.orderBy('tickets.purchase_date', 'desc').limit(pageSize).offset(offset)

    return {
      tickets,
      totalTickets: total,
      totalPage: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      pageSize
    }
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(id: string, companyId?: string): Promise<Ticket> {
    let query = Ticket.query()
      .findById(id)
      .withGraphFetched(
        '[account, order, trip.[busRoute.[route.[startLocation, endLocation]], template, buses.bus_companies], pickUpPoint, dropOffPoint, checker]'
      ) as any

    const ticket = await query

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // Verify company ownership if companyId provided
    // Check: ticket -> trip -> buses -> companyId
    if (companyId && ticket.trip?.buses?.companyId !== companyId) {
      throw new Error('Ticket does not belong to this company')
    }

    return ticket
  }

  /**
   * Update ticket
   */
  async updateTicket(
    id: string,
    data: Partial<{
      status: string
      pickupPointId: string
      dropoffPointId: string
      seatCode: string
      checkedDate: Date
      checkedBy: string
    }>,
    companyId?: string
  ): Promise<Ticket> {
    const ticket = await this.getTicketById(id, companyId)

    // If updating seat, check for conflicts
    if (data.seatCode && data.seatCode !== ticket.seatCode) {
      const existingTicket = await Ticket.query()
        .where('trip_id', ticket.tripId)
        .where('seat_code', data.seatCode)
        .whereNot('id', id)
        .whereNot('status', 'cancelled')
        .first()

      if (existingTicket) {
        throw new Error('Seat already booked for this trip')
      }
    }

    const updateData: any = {}
    if (data.status) updateData.status = data.status
    if (data.pickupPointId !== undefined) updateData.pickupPointId = data.pickupPointId
    if (data.dropoffPointId !== undefined) updateData.dropoffPointId = data.dropoffPointId
    if (data.seatCode) updateData.seatCode = data.seatCode
    if (data.checkedDate) updateData.checkedDate = data.checkedDate
    if (data.checkedBy) updateData.checkedBy = data.checkedBy

    await Ticket.query().patchAndFetchById(id, updateData)

    return await this.getTicketById(id, companyId)
  }

  /**
   * Delete ticket (soft delete by changing status to cancelled)
   */
  async deleteTicket(id: string, companyId?: string): Promise<void> {
    await this.getTicketById(id, companyId)

    // Instead of deleting, mark as cancelled
    await Ticket.query().patchAndFetchById(id, {
      status: 'cancelled'
    })
  }

  /**
   * Toggle ticket status
   */
  async toggleTicketStatus(id: string, companyId?: string): Promise<Ticket> {
    const ticket = await this.getTicketById(id, companyId)

    const newStatus = ticket.status === 'cancelled' ? 'confirmed' : 'cancelled'

    await Ticket.query().patchAndFetchById(id, {
      status: newStatus
    })

    return await this.getTicketById(id, companyId)
  }

  /**
   * Check-in ticket
   */
  async checkInTicket(id: string, checkedBy: string, companyId?: string): Promise<Ticket> {
    const ticket = await this.getTicketById(id, companyId)

    if (ticket.status === 'cancelled') {
      throw new Error('Cannot check in a cancelled ticket')
    }

    if (ticket.checkedDate) {
      throw new Error('Ticket already checked in')
    }

    await Ticket.query().patchAndFetchById(id, {
      status: 'checked_in',
      checkedDate: new Date(),
      checkedBy
    })

    return await this.getTicketById(id, companyId)
  }

  async lookupTicket(data: TicketLookupRequest) {
    const { email, phone, ticketCode } = data

    // Tìm vé với đầy đủ thông tin liên quan
    const ticketResult = await Ticket.query()
      .where('ticketCode', ticketCode)
      .withGraphFetched(
        `[
        account.[roles],
        order.[
          transaction,
          coupon
        ],
        trip.[
          busRoute.route.[
            startLocation.[city],
            endLocation.[city]
          ],
          buses.[
            bus_companies,
            type_buses
          ],
          tripPoints.point
        ],
        pickUpPoint,
        dropOffPoint
      ]`
      )
      .first()

    const ticket = ticketResult as TicketWithRelations

    if (!ticket) {
      return { success: false, message: 'Không tìm thấy vé với mã vé này', code: 'NOT_FOUND' }
    }

    // Kiểm tra email và phone có khớp với thông tin đặt vé không
    const ticketAccount = ticket.account
    if (!ticketAccount) {
      return { success: false, message: 'Không tìm thấy thông tin tài khoản đặt vé', code: 'NO_ACCOUNT' }
    }

    // Validate email và phone khớp với account
    if (ticketAccount.email !== email || ticketAccount.phone !== phone) {
      return {
        success: false,
        message: 'Email hoặc số điện thoại không khớp với thông tin đặt vé',
        code: 'UNAUTHORIZED'
      }
    }

    // Tìm thông tin time cho pickup và dropoff point từ tripPoints
    const pickupTripPoint = ticket.trip?.tripPoints?.find((tp: any) => tp.pointId === ticket.pickupPointId)
    const dropoffTripPoint = ticket.trip?.tripPoints?.find((tp: any) => tp.pointId === ticket.dropoffPointId)

    // Chuẩn bị response data với đầy đủ thông tin
    const ticketInfo = {
      // Thông tin vé
      ticket: {
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        seatCode: ticket.seatCode,
        status: ticket.status,
        qrCode: ticket.qrCode,
        purchaseDate: ticket.purchaseDate,
        checkedDate: ticket.checkedDate,
        checkedBy: ticket.checkedBy
      },

      // Thông tin chuyến xe
      trip: {
        id: ticket.trip?.id,
        departureTime: ticket.trip?.departureTime,
        arrivalTime: ticket.trip?.arrivalTime,
        price: ticket.trip?.price,
        status: ticket.trip?.status,
        route: {
          id: ticket.trip?.busRoute?.route?.id,
          distance: ticket.trip?.busRoute?.route?.distanceKm,
          startLocation: {
            id: ticket.trip?.busRoute?.route?.startLocation?.id,
            name: ticket.trip?.busRoute?.route?.startLocation?.name,
            cityName: ticket.trip?.busRoute?.route?.startLocation?.city?.name
          },
          endLocation: {
            id: ticket.trip?.busRoute?.route?.endLocation?.id,
            name: ticket.trip?.busRoute?.route?.endLocation?.name,
            cityName: ticket.trip?.busRoute?.route?.endLocation?.city?.name
          }
        },
        bus: {
          id: ticket.trip?.buses?.id,
          licensePlate: ticket.trip?.buses?.licensePlate,
          images: ticket.trip?.buses?.images,
          extensions: ticket.trip?.buses?.extensions,
          company: {
            id: ticket.trip?.buses?.bus_companies?.id,
            name: ticket.trip?.buses?.bus_companies?.name,
            phone: ticket.trip?.buses?.bus_companies?.phone,
            address: ticket.trip?.buses?.bus_companies?.address
          },
          typeBus: {
            id: ticket.trip?.buses?.type_buses?.id,
            name: ticket.trip?.buses?.type_buses?.name,
            totalSeats: ticket.trip?.buses?.type_buses?.totalSeats,
            isFloors: ticket.trip?.buses?.type_buses?.isFloors
          }
        }
      },

      // Thông tin người đặt vé
      passenger: {
        id: ticketAccount.id,
        name: ticketAccount.name,
        email: ticketAccount.email,
        phone: ticketAccount.phone,
        type: ticketAccount.type
      },

      // Thông tin đơn hàng
      order: {
        id: ticket.order?.id,
        originAmount: ticket.order?.originAmount,
        finalAmount: ticket.order?.finalAmount,
        status: ticket.order?.status,
        createdAt: ticket.order?.createdAt,
        coupon: ticket.order?.coupon
          ? {
              id: ticket.order.coupon.id,
              description: ticket.order.coupon.description,
              discountType: ticket.order.coupon.discountType,
              discountValue: ticket.order.coupon.discountValue
            }
          : null
      },

      // Thông tin thanh toán
      transaction: ticket.order?.transaction
        ? {
            id: ticket.order.transaction.id,
            amount: ticket.order.transaction.amount,
            paymentMethod: ticket.order.transaction.paymentMethod,
            status: ticket.order.transaction.status,
            createdAt: ticket.order.transaction.createdAt
          }
        : null,

      // Điểm đón (với time từ trip_points)
      pickUpPoint: ticket.pickUpPoint
        ? {
            id: ticket.pickUpPoint.id,
            type: ticket.pickUpPoint.type,
            time: pickupTripPoint?.time || null,
            locationName: ticket.pickUpPoint.locationName
          }
        : null,

      // Điểm trả (với time từ trip_points)
      dropOffPoint: ticket.dropOffPoint
        ? {
            id: ticket.dropOffPoint.id,
            type: ticket.dropOffPoint.type,
            time: dropoffTripPoint?.time || null,
            locationName: ticket.dropOffPoint.locationName
          }
        : null
    }

    return {
      success: true,
      message: 'Tra cứu vé thành công',
      data: ticketInfo
    }
  }
}

export default new TicketService()
