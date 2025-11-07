import Ticket from '../models/Ticket';
import Order from '../models/Order';

class MyTicketService {
  /**
   * Get user's tickets with filters
   */
  async getMyTickets(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const query = Ticket.query()
        .withGraphFetched(
          '[trip.[route.[startLocation.city, endLocation.city], buses.[bus_companies]], order.[coupon, transaction], pickUpPoint, dropOffPoint]'
        )
        .where('user_id', userId)
        .orderBy('purchase_date', 'desc');

      // Filter by status
      if (status && status !== 'all') {
        if (status === 'pending') {
          query.where('status', 'pending');
        } else if (status === 'valid') {
          query.where('status', 'valid');
        } else if (status === 'checked') {
          query.where('status', 'checked');
        }
      }

      // Pagination
      const offset = (page - 1) * limit;
      const tickets = await query.limit(limit).offset(offset);

      // Get total count
      const totalQuery = Ticket.query().where('user_id', userId);
      if (status && status !== 'all') {
        if (status === 'pending') {
          totalQuery.where('status', 'pending');
        } else if (status === 'valid') {
          totalQuery.where('status', 'valid');
        } else if (status === 'checked') {
          totalQuery.where('status', 'checked');
        }
      }
      const total = await totalQuery.resultSize();

      // Format response
      const formattedTickets = tickets.map((ticket: any) => ({
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        status: ticket.status,
        seatCode: ticket.seatCode,
        purchaseDate: ticket.purchaseDate,
        trip: {
          id: ticket.trip?.id,
          departureTime: ticket.trip?.departureTime,
          arrivalTime: ticket.trip?.arrivalTime,
          price: ticket.trip?.price,
          busCompany: {
            name: ticket.trip?.buses?.bus_companies?.name,
            logo: ticket.trip?.buses?.bus_companies?.logo,
          },
          route: {
            from: {
              location: ticket.trip?.route?.startLocation?.name,
              city: ticket.trip?.route?.startLocation?.city?.name,
            },
            to: {
              location: ticket.trip?.route?.endLocation?.name,
              city: ticket.trip?.route?.endLocation?.city?.name,
            },
          },
        },
        order: {
          id: ticket.order?.id,
          finalAmount: ticket.order?.finalAmount,
          originAmount: ticket.order?.originAmount,
          status: ticket.order?.status,
        },
        pickUpPoint: ticket.pickUpPoint
          ? {
              id: ticket.pickUpPoint.id,
              name: ticket.pickUpPoint.locationName,
            }
          : null,
        dropOffPoint: ticket.dropOffPoint
          ? {
              id: ticket.dropOffPoint.id,
              name: ticket.dropOffPoint.locationName,
            }
          : null,
      }));

      return {
        success: true,
        data: {
          tickets: formattedTickets,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      console.error('Get my tickets error:', error);
      throw error;
    }
  }

  /**
   * Get ticket detail by ID
   */
  async getTicketDetail(ticketId: string, userId: string) {
    try {
      const ticket = await Ticket.query()
        .findById(ticketId)
        .withGraphFetched(
          `[
            trip.[
              route.[startLocation.city, endLocation.city], 
              buses.[bus_companies, type_buses], 
              template
            ], 
            order.[coupon, transaction, account], 
            pickUpPoint, 
            dropOffPoint,
            account,
            checker
          ]`
        );

      if (!ticket) {
        return {
          success: false,
          message: 'Không tìm thấy vé',
        };
      }

      // Verify ownership
      if ((ticket as any).userId !== userId) {
        return {
          success: false,
          message: 'Bạn không có quyền xem vé này',
        };
      }

      console.log(ticket)
      // Format detailed response
      const formattedTicket = {
        ticketId: ticket.id,
        ticketCode: ticket.ticketCode,
        status: ticket.status,
        seatCode: ticket.seatCode,
        qrCode: ticket.qrCode,
        purchaseDate: ticket.purchaseDate,
        checkedDate: ticket.checkedDate,
        trip: {
          tripId: (ticket as any).trip?.id,
          departureDate: (ticket as any).trip?.departureDate,
          departureTime: (ticket as any).trip?.departureTime,
          arrivalTime: (ticket as any).trip?.arrivalTime,
          price: (ticket as any).trip?.price,
          route: {
            routeId: (ticket as any).trip?.route?.id,
            distance: (ticket as any).trip?.route?.distanceKm,
            startLocation: {
              locationId: (ticket as any).trip?.route?.startLocation?.id,
              locationName: (ticket as any).trip?.route?.startLocation?.name,
              city: {
                cityId: (ticket as any).trip?.route?.startLocation?.city?.id,
                cityName: (ticket as any).trip?.route?.startLocation?.city?.name,
              },
            },
            endLocation: {
              locationId: (ticket as any).trip?.route?.endLocation?.id,
              locationName: (ticket as any).trip?.route?.endLocation?.name,
              city: {
                cityId: (ticket as any).trip?.route?.endLocation?.city?.id,
                cityName: (ticket as any).trip?.route?.endLocation?.city?.name,
              },
            },
          },
          busCompany: {
            busCompanyId: (ticket as any).trip?.buses?.bus_companies?.id,
            busCompanyName: (ticket as any).trip?.buses?.bus_companies?.name,
            avatar: (ticket as any).trip?.buses?.bus_companies?.logo,
            phoneNumber: (ticket as any).trip?.buses?.bus_companies?.phone,
            email: (ticket as any).trip?.buses?.bus_companies?.email,
          },
          bus: {
            busId: (ticket as any).trip?.buses?.id,
            busNumber: (ticket as any).trip?.buses?.busNumber,
            licensePlate: (ticket as any).trip?.buses?.licensePlate,
            typeBus: {
              typeBusId: (ticket as any).trip?.buses?.type_buses?.id,
              typeBusName: (ticket as any).trip?.buses?.type_buses?.name,
              numberOfSeat: (ticket as any).trip?.buses?.type_buses?.totalSeats,
            },
          },
        },
        order: {
          orderId: (ticket as any).order?.id,
          finalAmount: (ticket as any).order?.finalAmount,
          originAmount: (ticket as any).order?.originAmount,
          createdAt: (ticket as any).order?.createdAt,
          transaction: (ticket as any).order?.transaction
            ? {
                transactionId: (ticket as any).order?.transaction?.id,
                transactionCode: (ticket as any).order?.transaction?.transactionCode,
                amount: (ticket as any).order?.transaction?.amount,
                paymentMethod: (ticket as any).order?.transaction?.paymentMethod,
                status: (ticket as any).order?.transaction?.status,
                transactionDate: (ticket as any).order?.transaction?.createdAt,
              }
            : null,
          coupon: (ticket as any).order?.coupon
            ? {
                couponId: (ticket as any).order?.coupon?.id,
                couponName: (ticket as any).order?.coupon?.name,
                couponCode: (ticket as any).order?.coupon?.code,
                discountPercentage: (ticket as any).order?.coupon?.discountPercentage,
              }
            : null,
        },
        pickUpPoint: (ticket as any).pickUpPoint
          ? {
              pointId: (ticket as any).pickUpPoint.id,
              pointName: (ticket as any).pickUpPoint.locationName,
              address: (ticket as any).pickUpPoint.address,
              time: (ticket as any).pickUpPoint.time,
            }
          : null,
        dropOffPoint: (ticket as any).dropOffPoint
          ? {
              pointId: (ticket as any).dropOffPoint.id,
              pointName: (ticket as any).dropOffPoint.locationName,
              address: (ticket as any).dropOffPoint.address,
              time: (ticket as any).dropOffPoint.time,
            }
          : null,
        account: {
          accountId: (ticket as any).account?.id,
          fullname: (ticket as any).account?.name,
          phone: (ticket as any).account?.phone,
          email: (ticket as any).account?.email,
        },
        checker: (ticket as any).checker
          ? {
              accountId: (ticket as any).checker?.id,
              fullname: (ticket as any).checker?.name,
            }
          : null,
      };

      return {
        success: true,
        data: formattedTicket,
      };
    } catch (error) {
      console.error('Get ticket detail error:', error);
      throw error;
    }
  }
}

export default new MyTicketService();
