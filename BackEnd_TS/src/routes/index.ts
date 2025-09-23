import express from 'express';
const router = express.Router();
import cityRouter from './city';
import tripRouter from './trip';

// router.use('/auth', authRouter);
// router.use('/user', userRouter);
router.use('/cities', cityRouter);
// router.use('/locations', localRouter);
// router.use('/routes', routeTripRouter);
// router.use('/bus-companies', busCompanyRouter);
// router.use('/buses', busRouter);
// router.use('/types-bus', typeBusRouter);
router.use('/trips', tripRouter);

export default router;