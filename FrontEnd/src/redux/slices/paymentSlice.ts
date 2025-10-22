import { createSlice } from '@reduxjs/toolkit'
import { createVNPayPayment, initialPaymentState, type PaymentState } from '../thunks/paymentThunks'

const paymentSlice = createSlice({
  name: 'payment',
  initialState: initialPaymentState,
  reducers: {
    resetPaymentState: (state) => {
      state.isLoading = false
      state.error = null
      state.paymentData = null
    },
    clearPaymentError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVNPayPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.paymentData = null
      })
      .addCase(createVNPayPayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
        state.paymentData = action.payload
      })
      .addCase(createVNPayPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Có lỗi xảy ra khi tạo thanh toán'
        state.paymentData = null
      })
  }
})

export const { resetPaymentState, clearPaymentError } = paymentSlice.actions
export default paymentSlice.reducer
export type { PaymentState }