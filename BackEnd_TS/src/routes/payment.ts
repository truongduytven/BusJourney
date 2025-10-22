import { Router } from 'express';
import { createPayment, vnpayReturn } from '../controllers/payment';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /payment/create:
 *   post:
 *     summary: Tạo thanh toán với VNPay
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Thông tin đặt vé và thanh toán
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *                 description: ID của chuyến xe
 *               userInformation:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phone:
 *                     type: string
 *                 required:
 *                   - name
 *                   - email
 *                   - phone
 *               selectedSeats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     seatCode:
 *                       type: string
 *                     price:
 *                       type: number
 *                   required:
 *                     - id
 *                     - seatCode
 *                     - price
 *               selectedPickUpPoint:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   locationName:
 *                     type: string
 *                   time:
 *                     type: string
 *                 required:
 *                   - id
 *                   - locationName
 *                   - time
 *               selectedDropOffPoint:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   locationName:
 *                     type: string
 *                   time:
 *                     type: string
 *                 required:
 *                   - id
 *                   - locationName
 *                   - time
 *               totalPrice:
 *                 type: number
 *                 description: Tổng giá tiền trước khi giảm giá
 *               paymentMethod:
 *                 type: string
 *                 enum: [vnpay]
 *                 description: Phương thức thanh toán
 *               voucherId:
 *                 type: string
 *                 description: ID của voucher giảm giá (tùy chọn)
 *             required:
 *               - tripId
 *               - userInformation
 *               - selectedSeats
 *               - selectedPickUpPoint
 *               - selectedDropOffPoint
 *               - totalPrice
 *               - paymentMethod
 *     responses:
 *       200:
 *         description: Tạo thanh toán thành công
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
 *                     orderId:
 *                       type: string
 *                     paymentUrl:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *                     finalAmount:
 *                       type: number
 *                     discountAmount:
 *                       type: number
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */
router.post('/create', authenticateToken, createPayment);

/**
 * @openapi
 * /payment/vnpay-return:
 *   get:
 *     summary: Xử lý kết quả trả về từ VNPay
 *     tags:
 *       - Payment
 *     parameters:
 *       - in: query
 *         name: vnp_Amount
 *         schema:
 *           type: string
 *         description: Số tiền thanh toán (VNPay format)
 *       - in: query
 *         name: vnp_BankCode
 *         schema:
 *           type: string
 *         description: Mã ngân hàng
 *       - in: query
 *         name: vnp_BankTranNo
 *         schema:
 *           type: string
 *         description: Mã giao dịch tại ngân hàng
 *       - in: query
 *         name: vnp_CardType
 *         schema:
 *           type: string
 *         description: Loại thẻ
 *       - in: query
 *         name: vnp_OrderInfo
 *         schema:
 *           type: string
 *         description: Thông tin đơn hàng
 *       - in: query
 *         name: vnp_PayDate
 *         schema:
 *           type: string
 *         description: Thời gian thanh toán
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: Mã phản hồi từ VNPay
 *       - in: query
 *         name: vnp_TmnCode
 *         schema:
 *           type: string
 *         description: Mã terminal
 *       - in: query
 *         name: vnp_TransactionNo
 *         schema:
 *           type: string
 *         description: Mã giao dịch VNPay
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Mã đơn hàng
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *         description: Chữ ký bảo mật
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang kết quả
 *       400:
 *         description: Chữ ký không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.get('/vnpay-return', vnpayReturn);

export default router;