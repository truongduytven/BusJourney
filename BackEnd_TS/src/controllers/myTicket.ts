import { Request, Response } from 'express';
import MyTicketService from '../services/MyTicketService';

class MyTicketController {
  /**
   * @swagger
   * /tickets/my-tickets:
   *   get:
   *     summary: Get user's tickets
   *     tags: [My Tickets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [all, pending, paid, checked]
   *         description: Filter by ticket status
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Unauthorized
   */
  async getMyTickets(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.accountId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const status = req.query.status as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await MyTicketService.getMyTickets(userId, status, page, limit);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Get my tickets error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /tickets/{id}/detail:
   *   get:
   *     summary: Get ticket detail
   *     tags: [My Tickets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Ticket ID
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Ticket not found
   */
  async getTicketDetail(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.accountId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const ticketId = req.params.id;

      const result = await MyTicketService.getTicketDetail(ticketId, userId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Get ticket detail error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new MyTicketController();
