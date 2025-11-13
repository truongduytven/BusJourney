import express from 'express';
import {
  getListCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  extendCoupon,
} from '../controllers/couponManagement';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupon Management
 *   description: Coupon management and validation endpoints
 */

// Public routes
router.get('/list', getListCoupons);
router.get('/:id', getCouponById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createCoupon);
router.put('/:id', authenticateToken, updateCoupon);
router.patch('/:id/toggle-status', authenticateToken, toggleCouponStatus);
router.patch('/:id/extend', authenticateToken, extendCoupon);

export default router;
