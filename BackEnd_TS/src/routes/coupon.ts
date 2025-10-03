import express from 'express'
import CouponController from '../controllers/coupon'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management and validation endpoints
 */

// Validate coupon for user
router.post('/validate', CouponController.validateCoupon)

// Apply coupon and calculate discount
router.post('/apply', CouponController.applyCoupon)

// Get available coupons for user
router.get('/available/:userId', CouponController.getAvailableCoupons)

// Get user's coupon usage history
router.get('/usage-history/:userId', CouponController.getCouponUsageHistory)

// Get coupon details by code
router.get('/:couponCode', CouponController.getCouponByCode)

export default router