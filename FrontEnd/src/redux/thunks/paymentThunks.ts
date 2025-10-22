import { createAsyncThunk } from '@reduxjs/toolkit'
import type { InformationCheckout } from '@/types/selectedTrip'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface PaymentResponse {
  success: boolean
  message: string
  data: {
    orderId: string
    paymentUrl: string
    totalAmount: number
    finalAmount: number
    discountAmount: number
  }
}

interface PaymentError {
  success: boolean
  message: string
  error?: string
}

export const createVNPayPayment = createAsyncThunk<
  PaymentResponse['data'],
  InformationCheckout,
  {
    rejectValue: string
  }
>(
  'payment/createVNPay',
  async (checkoutData, { rejectWithValue }) => {
    try {
      // Lấy token từ localStorage hoặc Redux store
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để thanh toán')
      }

      // Chuẩn bị data theo format backend mong đợi
      const paymentData = {
        tripId: checkoutData.tripId,
        userInformation: checkoutData.userInformation,
        selectedSeats: checkoutData.selectedSeats,
        selectedPickUpPoint: checkoutData.selectedPickUpPoint,
        selectedDropOffPoint: checkoutData.selectedDropOffPoint,
        totalPrice: checkoutData.totalPrice,
        paymentMethod: checkoutData.paymentMethod,
        voucherId: checkoutData.voucherId || undefined
      }
      console.log(paymentData)

      const response = await fetch(`${API_BASE_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      })

      const result: PaymentResponse | PaymentError = await response.json()

      if (!response.ok || !result.success) {
        return rejectWithValue(result.message || 'Có lỗi xảy ra khi tạo thanh toán')
      }

      return (result as PaymentResponse).data
    } catch (error) {
      console.error('Payment creation error:', error)
      return rejectWithValue('Không thể kết nối đến server')
    }
  }
)

// Interface cho payment state
interface PaymentState {
  isLoading: boolean
  error: string | null
  paymentData: PaymentResponse['data'] | null
}

// Initial state
const initialPaymentState: PaymentState = {
  isLoading: false,
  error: null,
  paymentData: null
}

export { initialPaymentState }
export type { PaymentState, PaymentResponse }