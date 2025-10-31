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
}

export default new TicketController();

// Export for backward compatibility
export const { lookupTicket } = new TicketController();