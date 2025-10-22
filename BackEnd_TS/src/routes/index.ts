import express from 'express';
const router = express.Router();
import cityRouter from './city';
import tripRouter from './trip';
import authRouter from './auth';
import ticketRouter from './ticket';
import couponRouter from './coupon';
import paymentRouter from './payment';

router.use('/auth', authRouter);
// router.use('/user', userRouter);
router.use('/cities', cityRouter);
// router.use('/locations', localRouter);
// router.use('/routes', routeTripRouter);
// router.use('/bus-companies', busCompanyRouter);
// router.use('/buses', busRouter);
// router.use('/types-bus', typeBusRouter);
router.use('/trips', tripRouter);
router.use('/tickets', ticketRouter);
router.use('/coupons', couponRouter);
router.use('/payment', paymentRouter);

export default router;