import { Router } from 'express';
import { lookupTicket } from '../controllers/ticket';

const router = Router();

/**
 * @openapi
 * /tickets/lookup:
 *   post:
 *     summary: Tra cứu thông tin vé
 *     tags:
 *       - Tickets
 *     requestBody:
 *       description: Thông tin tra cứu vé
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               ticketCode:
 *                 type: string
 *             required:
 *               - email
 *               - phone
 *               - ticketCode
 *     responses:
 *       200:
 *         description: Tra cứu vé thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     ticket:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         ticketCode:
 *                           type: string
 *                         seatCode:
 *                           type: string
 *                         status:
 *                           type: string
 *                           enum: [processing, valid, checked, cancelled]
 *                         qrCode:
 *                           type: string
 *                         purchasedDate:
 *                           type: string
 *                           format: date-time
 *                         checkedDate:
 *                           type: string
 *                           format: date-time
 *                         checkedBy:
 *                           type: string
 *                     trip:
 *                       type: object
 *                     passenger:
 *                       type: object
 *                     order:
 *                       type: object
 *                     transaction:
 *                       type: object
 *                     pickUpPoint:
 *                       type: object
 *                     dropOffPoint:
 *                       type: object
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Email hoặc số điện thoại không khớp
 *       404:
 *         description: Không tìm thấy vé
 *       500:
 *         description: Lỗi server
 */
router.post('/lookup', lookupTicket);

export default router;