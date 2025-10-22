import { Request, Response } from 'express';
import Ticket from '../models/Ticket';

// Type definitions for relations
interface TicketWithRelations extends Ticket {
  account?: any;
  order?: any;
  trip?: any;
  pickUpPoint?: any;
  dropOffPoint?: any;
}

// Interface cho request body tra cứu vé
interface TicketLookupRequest {
  email: string;
  phone: string;
  ticketCode: string;
}

export const lookupTicket = async (req: Request<{}, {}, TicketLookupRequest>, res: Response) => {
  try {
    const { email, phone, ticketCode } = req.body;

    // Validation input
    if (!email || !phone || !ticketCode) {
      return res.status(400).json({
        success: false,
        message: 'Email, số điện thoại và mã vé là bắt buộc'
      });
    }

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
          route.[
            startLocation.[city],
            endLocation.[city]
          ],
          buses.[
            bus_companies,
            type_buses
          ]
        ],
        pickUpPoint,
        dropOffPoint
      ]`)
      .first();

    const ticket = ticketResult as TicketWithRelations;

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vé với mã vé này'
      });
    }

    // Kiểm tra email và phone có khớp với thông tin đặt vé không
    const ticketAccount = ticket.account;
    if (!ticketAccount) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin tài khoản đặt vé'
      });
    }

    // Validate email và phone khớp với account
    if (ticketAccount.email !== email || ticketAccount.phone !== phone) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc số điện thoại không khớp với thông tin đặt vé'
      });
    }

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
          id: ticket.trip?.route?.id,
          distance: ticket.trip?.route?.distance,
          startLocation: {
            id: ticket.trip?.route?.startLocation?.id,
            name: ticket.trip?.route?.startLocation?.name,
            cityName: ticket.trip?.route?.startLocation?.city?.name
          },
          endLocation: {
            id: ticket.trip?.route?.endLocation?.id,
            name: ticket.trip?.route?.endLocation?.name,
            cityName: ticket.trip?.route?.endLocation?.city?.name
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

      // Điểm đón
      pickUpPoint: ticket.pickUpPoint ? {
        id: ticket.pickUpPoint.id,
        type: ticket.pickUpPoint.type,
        time: ticket.pickUpPoint.time,
        locationName: ticket.pickUpPoint.locationName
      } : null,

      // Điểm trả
      dropOffPoint: ticket.dropOffPoint ? {
        id: ticket.dropOffPoint.id,
        type: ticket.dropOffPoint.type,
        time: ticket.dropOffPoint.time,
        locationName: ticket.dropOffPoint.locationName
      } : null
    };

    return res.status(200).json({
      success: true,
      message: 'Tra cứu vé thành công',
      data: ticketInfo
    });

  } catch (error) {
    console.error('Ticket lookup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tra cứu vé',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};