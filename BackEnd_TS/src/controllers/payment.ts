import { Request, Response } from 'express'
import crypto from 'crypto'
import querystring from 'qs'
import Order from '../models/Order'
import Ticket from '../models/Ticket'
import Transaction from '../models/Transaction'
import CouponService from '../services/CouponService'
import { config } from 'dotenv'
import moment from 'moment'

config()

const vnpay_config = {
  vnp_TmnCode: process.env.VNP_TMNCODE || 'YOUR_TMN_CODE',
  vnp_HashSecret: process.env.VNP_HASHSECRET || 'YOUR_HASH_SECRET',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  vnp_ReturnUrl: `http://localhost:3000/api/payment/vnpay-return`
}

interface ICreatePaymentRequest {
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

export const createPayment = async (req: Request<{}, {}, ICreatePaymentRequest>, res: Response) => {
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

    let finalAmount = totalPrice
    let appliedCoupon = null

    if (voucherId) {
      try {
        const couponResult = await CouponService.applyCoupon({
          couponId: voucherId,
          userId,
          originalAmount: totalPrice
        })

        if (!couponResult.isValid) {
          return res.status(400).json({ success: false, message: couponResult.message })
        }

        finalAmount = couponResult.finalAmount || totalPrice
        appliedCoupon = { id: voucherId }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error instanceof Error ? error.message : 'Lỗi áp dụng voucher'
        })
      }
    }

    const result = await Order.query().insert({
      userId,
      couponId: appliedCoupon?.id || null,
      originAmount: totalPrice,
      finalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    const ticketPromises = selectedSeats.map((seat: any) => {
      const ticketCode = generateTicketCode()
      return Ticket.query().insert({
        ticketCode,
        orderId: result.id,
        tripId,
        userId: userId,
        seatCode: seat.code,
        pickupPointId: selectedPickUpPoint.id,
        dropoffPointId: selectedDropOffPoint.id,
        status: 'pending',
        purchaseDate: new Date(),
        qrCode: generateQRCode(ticketCode)
      })
    })
    await Promise.all(ticketPromises)

    const vnpayUrl = createVNPayUrl({
      orderId: result.id,
      amount: finalAmount,
      orderInfo: `Thanh toan ve xe`,
      req: req
    })

    return res.status(200).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: {
        orderId: result.id,
        paymentUrl: vnpayUrl,
        totalAmount: totalPrice,
        finalAmount,
        discountAmount: totalPrice - finalAmount
      }
    })
  } catch (error) {
    console.error('Create payment error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo thanh toán',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const vnpayReturn = async (req: Request, res: Response) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
  try {
    const vnp_Params = req.query
    const orderId = vnp_Params['vnp_TxnRef'] as string
    const responseCode = vnp_Params['vnp_ResponseCode'] as string
    const transactionNo = vnp_Params['vnp_TransactionNo'] as string
    const amount = parseInt(vnp_Params['vnp_Amount'] as string) / 100

    if (responseCode === '00') {
      await handleSuccessfulPayment(orderId, transactionNo, amount)
      return res.redirect(`${FRONTEND_URL}/payment-success?orderId=${orderId}`)
    } else {
      await handleFailedPayment(orderId)
      return res.redirect(`${FRONTEND_URL}/payment-failure?orderId=${orderId}`)
    }
  } catch (error) {
    console.error('VNPay return error:', error)
    return res.redirect(`${FRONTEND_URL}/payment/error?reason=server-error`)
  }
}

// ===== Helper functions =====

function createVNPayUrl(params: {
  orderId: string
  amount: number
  orderInfo: string
  req: any
}) {
  const { orderId, amount, req } = params
  process.env.TZ = 'Asia/Ho_Chi_Minh'
  let date = new Date()
  let createDate = moment(date).format('YYYYMMDDHHmmss')
  let ipAddr =
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

  const sortedParams = sortObject(vnp_Params)
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

function sortObject(obj: any) {
  const sorted: any = {}
  const keys = Object.keys(obj).sort()
  keys.forEach((key) => {
    sorted[key] = obj[key]
  })
  return sorted
}

async function handleSuccessfulPayment(orderId: string, transactionNo: string, amount: number) {
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

async function handleFailedPayment(orderId: string) {
  await Order.query().findById(orderId).patch({ status: 'failed' })
  await Ticket.query().where('orderId', orderId).patch({ status: 'cancelled' })
}

function generateTicketCode(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `TICKET${timestamp.slice(-6)}${random}`
}

function generateQRCode(ticketCode: string): string {
  return `QR_${ticketCode}`
}
