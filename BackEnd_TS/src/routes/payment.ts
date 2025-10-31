import { Router } from 'express';
import { createPayment, vnpayReturn } from '../controllers/payment';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment processing with VNPay integration
 */

router.post('/create', authenticateToken, createPayment);
router.get('/vnpay-return', vnpayReturn);

export default router;