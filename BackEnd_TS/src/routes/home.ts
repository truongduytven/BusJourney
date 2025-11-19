import { Router } from 'express';
import HomeController from '../controllers/home';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Home
 *   description: Homepage data endpoints
 */

router.get('/featured-routes', HomeController.getFeaturedRoutes);
router.get('/active-coupons', HomeController.getActiveCoupons);
router.get('/featured-reviews', HomeController.getFeaturedReviews);

export default router;
