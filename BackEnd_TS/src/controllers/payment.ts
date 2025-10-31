import { Request, Response } from 'express'
import PaymentService, { CreatePaymentRequest } from '../services/PaymentService'

class PaymentController {
  /**
   * @swagger
   * /payment/create:
   *   post:
   *     summary: Tạo thanh toán với VNPay
   *     tags: [Payment]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       description: Thông tin đặt vé và thanh toán
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - tripId
   *               - userInformation
   *               - selectedSeats
   *               - selectedPickUpPoint
   *               - selectedDropOffPoint
   *               - totalPrice
   *               - paymentMethod
   *             properties:
   *               tripId:
   *                 type: string
   *               userInformation:
   *                 type: object
   *                 required:
   *                   - name
   *                   - email
   *                   - phone
   *                 properties:
   *                   name:
   *                     type: string
   *                   email:
   *                     type: string
   *                   phone:
   *                     type: string
   *               selectedSeats:
   *                 type: array
   *                 items:
   *                   type: object
   *               selectedPickUpPoint:
   *                 type: object
   *               selectedDropOffPoint:
   *                 type: object
   *               totalPrice:
   *                 type: number
   *               paymentMethod:
   *                 type: string
   *                 enum: [vnpay]
   *               voucherId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Tạo thanh toán thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       401:
   *         description: Chưa đăng nhập
   *       500:
   *         description: Lỗi server
   */
  async createPayment(req: Request<{}, {}, CreatePaymentRequest>, res: Response) {
    try {
      const {
        tripId,
        userInformation,
        selectedSeats,
        selectedPickUpPoint,
        selectedDropOffPoint,
        totalPrice,
        paymentMethod,
        voucherId
      } = req.body

      if (!tripId || !userInformation || !selectedSeats || selectedSeats.length === 0) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' })
      }

      if (paymentMethod !== 'vnpay') {
        return res.status(400).json({ success: false, message: 'Phương thức thanh toán không được hỗ trợ' })
      }

      const userId = req.user?.accountId
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để thanh toán' })
      }

      const result = await PaymentService.createPayment(userId, req.body, req)

      if (!result.success) {
        return res.status(400).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('Create payment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo thanh toán',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * @swagger
   * /payment/vnpay-return:
   *   get:
   *     summary: Xử lý kết quả trả về từ VNPay
   *     tags: [Payment]
   *     parameters:
   *       - in: query
   *         name: vnp_ResponseCode
   *         schema:
   *           type: string
   *         description: Mã phản hồi từ VNPay
   *       - in: query
   *         name: vnp_TxnRef
   *         schema:
   *           type: string
   *         description: Mã đơn hàng
   *       - in: query
   *         name: vnp_TransactionNo
   *         schema:
   *           type: string
   *         description: Mã giao dịch VNPay
   *       - in: query
   *         name: vnp_Amount
   *         schema:
   *           type: string
   *         description: Số tiền thanh toán
   *     responses:
   *       302:
   *         description: Chuyển hướng đến trang kết quả
   *       500:
   *         description: Lỗi server
   */
  async vnpayReturn(req: Request, res: Response) {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
    try {
      const vnp_Params = req.query
      
      const result = await PaymentService.handleVNPayReturn({
        vnp_TxnRef: vnp_Params['vnp_TxnRef'] as string,
        vnp_ResponseCode: vnp_Params['vnp_ResponseCode'] as string,
        vnp_TransactionNo: vnp_Params['vnp_TransactionNo'] as string,
        vnp_Amount: vnp_Params['vnp_Amount'] as string
      })

      if (result.success) {
        return res.redirect(`${FRONTEND_URL}/payment-success?orderId=${result.orderId}`)
      } else {
        return res.redirect(`${FRONTEND_URL}/payment-failure?orderId=${result.orderId}`)
      }
    } catch (error) {
      console.error('VNPay return error:', error)
      return res.redirect(`${FRONTEND_URL}/payment/error?reason=server-error`)
    }
  }
}

export default new PaymentController();

// Export for backward compatibility
export const { createPayment, vnpayReturn } = new PaymentController();