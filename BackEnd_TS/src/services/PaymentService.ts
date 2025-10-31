import crypto from 'crypto'
import querystring from 'qs'
import moment from 'moment'
import { config } from 'dotenv'
import Order from '../models/Order'
import Ticket from '../models/Ticket'
import Transaction from '../models/Transaction'
import CouponService from './CouponService'

config()

const vnpay_config = {
  vnp_TmnCode: process.env.VNP_TMNCODE || 'YOUR_TMN_CODE',
  vnp_HashSecret: process.env.VNP_HASHSECRET || 'YOUR_HASH_SECRET',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  vnp_ReturnUrl: `http://localhost:3000/api/payment/vnpay-return`
}

export interface CreatePaymentRequest {
  tripId: string
  userInformation: {
    name: string
    email: string
    phone: string
  }
  selectedSeats: Array<{
    id: string
    code: string
  }>
  selectedPickUpPoint: {
    id: string
    locationName: string
    time: string
  }
  selectedDropOffPoint: {
    id: string
    locationName: string
    time: string
  }
  totalPrice: number
  paymentMethod: string
  voucherId?: string
}

export interface VNPayReturnParams {
  vnp_TxnRef: string
  vnp_ResponseCode: string
  vnp_TransactionNo: string
  vnp_Amount: string
}

class PaymentService {
  /**
   * Tạo đơn hàng và URL thanh toán VNPay
   */
  async createPayment(userId: string, data: CreatePaymentRequest, req: any) {
    const {
      tripId,
      selectedSeats,
      selectedPickUpPoint,
      selectedDropOffPoint,
      totalPrice,
      voucherId
    } = data

    // Xử lý voucher nếu có
    let finalAmount = totalPrice
    let appliedCoupon = null

    if (voucherId) {
      const couponResult = await CouponService.applyCoupon({
        couponId: voucherId,
        userId,
        originalAmount: totalPrice
      })

      if (!couponResult.isValid) {
        return {
          success: false,
          message: couponResult.message
        }
      }

      finalAmount = couponResult.finalAmount || totalPrice
      appliedCoupon = { id: voucherId }
    }

    // Tạo order
    const order = await Order.query().insert({
      userId,
      couponId: appliedCoupon?.id || null,
      originAmount: totalPrice,
      finalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    // Tạo tickets
    const ticketPromises = selectedSeats.map((seat) => {
      const ticketCode = this.generateTicketCode()
      return Ticket.query().insert({
        ticketCode,
        orderId: order.id,
        tripId,
        userId,
        seatCode: seat.code,
        pickupPointId: selectedPickUpPoint.id,
        dropoffPointId: selectedDropOffPoint.id,
        status: 'pending',
        purchaseDate: new Date(),
        qrCode: this.generateQRCode(ticketCode)
      })
    })
    await Promise.all(ticketPromises)

    // Tạo VNPay URL
    const vnpayUrl = this.createVNPayUrl({
      orderId: order.id,
      amount: finalAmount,
      orderInfo: 'Thanh toan ve xe',
      req
    })

    return {
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: {
        orderId: order.id,
        paymentUrl: vnpayUrl,
        totalAmount: totalPrice,
        finalAmount,
        discountAmount: totalPrice - finalAmount
      }
    }
  }

  /**
   * Xử lý callback từ VNPay
   */
  async handleVNPayReturn(params: VNPayReturnParams) {
    const { vnp_TxnRef: orderId, vnp_ResponseCode: responseCode, vnp_TransactionNo: transactionNo, vnp_Amount } = params
    const amount = parseInt(vnp_Amount) / 100

    if (responseCode === '00') {
      await this.handleSuccessfulPayment(orderId, transactionNo, amount)
      return {
        success: true,
        status: 'success',
        orderId
      }
    } else {
      await this.handleFailedPayment(orderId)
      return {
        success: false,
        status: 'failed',
        orderId
      }
    }
  }

  /**
   * Tạo VNPay payment URL
   */
  private createVNPayUrl(params: {
    orderId: string
    amount: number
    orderInfo: string
    req: any
  }) {
    const { orderId, amount, req } = params
    process.env.TZ = 'Asia/Ho_Chi_Minh'
    const date = new Date()
    const createDate = moment(date).format('YYYYMMDDHHmmss')
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
    
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpay_config.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: vnpay_config.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    }

    const sortedParams = this.sortObject(vnp_Params)
    let signData = querystring.stringify(sortedParams, { encode: false })
    signData = signData.replace(/:/g, '%3A').replace(/ /g, '+').replace(/\//g, '%2F')
    const hmac = crypto.createHmac('sha512', vnpay_config.vnp_HashSecret)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    sortedParams.vnp_SecureHash = signed
    let vnpayUrl = '?' + querystring.stringify(sortedParams, { encode: false })
    vnpayUrl = vnpayUrl.replace(/:/g, '%3A').replace(/ /g, '+').replace(/\//g, '%2F')
    vnpayUrl = vnpay_config.vnp_Url + vnpayUrl
    return vnpayUrl
  }

  /**
   * Xử lý thanh toán thành công
   */
  private async handleSuccessfulPayment(orderId: string, transactionNo: string, amount: number) {
    await Order.query().findById(orderId).patch({ status: 'completed' })
    await Ticket.query().where('orderId', orderId).patch({ status: 'valid' })

    await Transaction.query().insert({
      orderId,
      amount,
      paymentMethod: 'vnpay',
      status: 'completed',
      createdAt: new Date().toISOString()
    })

    const order = await Order.query().findById(orderId).withGraphFetched('account')
    if (order && order.couponId) {
      await CouponService.recordCouponUsage(order.userId, order.couponId, orderId)
    }
  }

  /**
   * Xử lý thanh toán thất bại
   */
  private async handleFailedPayment(orderId: string) {
    await Order.query().findById(orderId).patch({ status: 'failed' })
    await Ticket.query().where('orderId', orderId).patch({ status: 'cancelled' })
  }

  /**
   * Helper: Sort object keys
   */
  private sortObject(obj: any) {
    const sorted: any = {}
    const keys = Object.keys(obj).sort()
    keys.forEach((key) => {
      sorted[key] = obj[key]
    })
    return sorted
  }

  /**
   * Helper: Generate ticket code
   */
  private generateTicketCode(): string {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `TICKET${timestamp.slice(-6)}${random}`
  }

  /**
   * Helper: Generate QR code
   */
  private generateQRCode(ticketCode: string): string {
    return `QR_${ticketCode}`
  }
}

export default new PaymentService()
