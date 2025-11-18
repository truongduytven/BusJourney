import { Request, Response } from 'express';
import TicketService, { TicketLookupRequest } from '../services/TicketService';

class TicketController {
  /**
   * @swagger
   * /tickets/lookup:
   *   post:
   *     summary: Tra cứu thông tin vé
   *     tags: [Tickets]
   *     requestBody:
   *       description: Thông tin tra cứu vé
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - phone
   *               - ticketCode
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               phone:
   *                 type: string
   *               ticketCode:
   *                 type: string
   *     responses:
   *       200:
   *         description: Tra cứu vé thành công
   *       400:
   *         description: Dữ liệu đầu vào không hợp lệ
   *       401:
   *         description: Email hoặc số điện thoại không khớp
   *       404:
   *         description: Không tìm thấy vé
   *       500:
   *         description: Lỗi server
   */
  async lookupTicket(req: Request<{}, {}, TicketLookupRequest>, res: Response) {
    try {
      const { email, phone, ticketCode } = req.body;

      // Validation input
      if (!email || !phone || !ticketCode) {
        return res.status(400).json({
          success: false,
          message: 'Email, số điện thoại và mã vé là bắt buộc'
        });
      }

      const result = await TicketService.lookupTicket({ email, phone, ticketCode });

      if (!result.success) {
        const statusCode = result.code === 'NOT_FOUND' ? 404 : 
                          result.code === 'UNAUTHORIZED' ? 401 : 400;
        return res.status(statusCode).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Ticket lookup error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi tra cứu vé',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /admin/tickets/list:
   *   get:
   *     summary: Get paginated list of tickets (Admin)
   *     tags: [Admin - Tickets]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by ticket code or seat code
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *         description: Filter by ticket status
   *       - in: query
   *         name: userId
   *         schema:
   *           type: string
   *         description: Filter by user ID
   *       - in: query
   *         name: tripId
   *         schema:
   *           type: string
   *         description: Filter by trip ID
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: pageNumber
   *         schema:
   *           type: integer
   *           default: 1
   *     responses:
   *       200:
   *         description: List of tickets retrieved successfully
   */
  async getListTickets(req: Request, res: Response) {
    try {
      const { search, status, userId, tripId, orderId, pageSize, pageNumber } = req.query;

      const filters = {
        search: search as string,
        status: status as string,
        userId: userId as string,
        tripId: tripId as string,
        orderId: orderId as string,
        pageSize: pageSize ? parseInt(pageSize as string) : 10,
        pageNumber: pageNumber ? parseInt(pageNumber as string) : 1,
      };

      const result = await TicketService.getListTickets(filters);

      res.status(200).json({
        message: 'Tickets retrieved successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Error retrieving tickets',
        error: error.message,
      });
    }
  }

  /**
   * @swagger
   * /company-tickets/company/list:
   *   get:
   *     summary: Get paginated list of tickets for company
   *     tags: [Company - Tickets]
   */
  async getCompanyTickets(req: Request, res: Response) {
    try {
      const { search, status, userId, tripId, orderId, pageSize, pageNumber } = req.query;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          message: 'Company ID not found in request',
        });
      }

      const filters = {
        search: search as string,
        status: status as string,
        userId: userId as string,
        tripId: tripId as string,
        orderId: orderId as string,
        pageSize: pageSize ? parseInt(pageSize as string) : 10,
        pageNumber: pageNumber ? parseInt(pageNumber as string) : 1,
        companyId,
      };

      const result = await TicketService.getListTickets(filters);

      res.status(200).json({
        message: 'Tickets retrieved successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Error retrieving tickets',
        error: error.message,
      });
    }
  }

  async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await TicketService.getTicketById(id);

      res.status(200).json({
        message: 'Ticket retrieved successfully',
        data: ticket,
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error retrieving ticket',
          error: error.message,
        });
      }
    }
  }

  async getCompanyTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          message: 'Company ID not found in request',
        });
      }

      const ticket = await TicketService.getTicketById(id, companyId);

      res.status(200).json({
        message: 'Ticket retrieved successfully',
        data: ticket,
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Ticket does not belong to this company') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error retrieving ticket',
          error: error.message,
        });
      }
    }
  }

  async updateTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, pickupPointId, dropoffPointId, seatCode, checkedBy } = req.body;

      const ticket = await TicketService.updateTicket(id, {
        status,
        pickupPointId,
        dropoffPointId,
        seatCode,
        checkedBy,
      });

      res.status(200).json({
        message: 'Ticket updated successfully',
        data: ticket,
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message.includes('already booked')) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error updating ticket',
          error: error.message,
        });
      }
    }
  }

  async updateCompanyTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, pickupPointId, dropoffPointId, seatCode } = req.body;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          message: 'Company ID not found in request',
        });
      }

      const ticket = await TicketService.updateTicket(id, {
        status,
        pickupPointId,
        dropoffPointId,
        seatCode,
      }, companyId);

      res.status(200).json({
        message: 'Ticket updated successfully',
        data: ticket,
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Ticket does not belong to this company') {
        res.status(403).json({ message: error.message });
      } else if (error.message.includes('already booked')) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error updating ticket',
          error: error.message,
        });
      }
    }
  }

  async deleteTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await TicketService.deleteTicket(id);

      res.status(200).json({
        message: 'Ticket deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error deleting ticket',
          error: error.message,
        });
      }
    }
  }

  async deleteCompanyTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          message: 'Company ID not found in request',
        });
      }

      await TicketService.deleteTicket(id, companyId);

      res.status(200).json({
        message: 'Ticket deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Ticket does not belong to this company') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error deleting ticket',
          error: error.message,
        });
      }
    }
  }

  async toggleTicketStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await TicketService.toggleTicketStatus(id);

      res.status(200).json({
        message: 'Ticket status toggled successfully',
        data: ticket,
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error toggling ticket status',
          error: error.message,
        });
      }
    }
  }

  async toggleCompanyTicketStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          message: 'Company ID not found in request',
        });
      }

      const ticket = await TicketService.toggleTicketStatus(id, companyId);

      res.status(200).json({
        message: 'Ticket status toggled successfully',
        data: ticket,
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Ticket does not belong to this company') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error toggling ticket status',
          error: error.message,
        });
      }
    }
  }

  async checkInTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyId = (req as any).user?.companyId;
      const checkedBy = (req as any).user?.id;

      if (!companyId) {
        return res.status(403).json({
          message: 'Company ID not found in request',
        });
      }

      const ticket = await TicketService.checkInTicket(id, checkedBy, companyId);

      res.status(200).json({
        message: 'Ticket checked in successfully',
        data: ticket,
      });
    } catch (error: any) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Ticket does not belong to this company') {
        res.status(403).json({ message: error.message });
      } else if (error.message.includes('Cannot check in') || error.message.includes('already checked')) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({
          message: 'Error checking in ticket',
          error: error.message,
        });
      }
    }
  }
}

export default new TicketController();

// Export individual methods
export const { 
  lookupTicket,
  getListTickets,
  getCompanyTickets,
  getTicketById,
  getCompanyTicketById,
  updateTicket,
  updateCompanyTicket,
  deleteTicket,
  deleteCompanyTicket,
  toggleTicketStatus,
  toggleCompanyTicketStatus,
  checkInTicket,
} = new TicketController();
