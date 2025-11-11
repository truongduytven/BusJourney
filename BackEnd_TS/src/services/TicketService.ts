import Ticket from '../models/Ticket'

// Type definitions for relations
interface TicketWithRelations extends Ticket {
  account?: any
  order?: any
  trip?: any
  pickUpPoint?: any
  dropOffPoint?: any
}

// Interface cho request body tra cứu vé
export interface TicketLookupRequest {
  email: string
  phone: string
  ticketCode: string
}

class TicketService {
  async lookupTicket(data: TicketLookupRequest) {
    const { email, phone, ticketCode } = data

    // Tìm vé với đầy đủ thông tin liên quan
    const ticketResult = await Ticket.query()
      .where('ticketCode', ticketCode)
      .withGraphFetched(`[
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
      ]`)
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
    const pickupTripPoint = ticket.trip?.tripPoints?.find(
      (tp: any) => tp.pointId === ticket.pickupPointId
    )
    const dropoffTripPoint = ticket.trip?.tripPoints?.find(
      (tp: any) => tp.pointId === ticket.dropoffPointId
    )

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
        coupon: ticket.order?.coupon ? {
          id: ticket.order.coupon.id,
          description: ticket.order.coupon.description,
          discountType: ticket.order.coupon.discountType,
          discountValue: ticket.order.coupon.discountValue
        } : null
      },

      // Thông tin thanh toán
      transaction: ticket.order?.transaction ? {
        id: ticket.order.transaction.id,
        amount: ticket.order.transaction.amount,
        paymentMethod: ticket.order.transaction.paymentMethod,
        status: ticket.order.transaction.status,
        createdAt: ticket.order.transaction.createdAt
      } : null,

      // Điểm đón (với time từ trip_points)
      pickUpPoint: ticket.pickUpPoint ? {
        id: ticket.pickUpPoint.id,
        type: ticket.pickUpPoint.type,
        time: pickupTripPoint?.time || null,
        locationName: ticket.pickUpPoint.locationName
      } : null,

      // Điểm trả (với time từ trip_points)
      dropOffPoint: ticket.dropOffPoint ? {
        id: ticket.dropOffPoint.id,
        type: ticket.dropOffPoint.type,
        time: dropoffTripPoint?.time || null,
        locationName: ticket.dropOffPoint.locationName
      } : null
    }

    return {
      success: true,
      message: 'Tra cứu vé thành công',
      data: ticketInfo
    }
  }
}

export default new TicketService()
