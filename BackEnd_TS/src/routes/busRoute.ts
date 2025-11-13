import express from 'express';
import { authenticateToken, requireCompany } from '../middlewares/authMiddleware';
import {
  listBusRoutes,
  getBusRoute,
  createBusRoute,
  updateBusRouteStatus,
  deleteBusRoute,
  getApprovedRoutes,
} from '../controllers/busRoute';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bus Routes
 *   description: Bus route search and management endpoints
 */

router.use(authenticateToken);
router.use(requireCompany);

router.get('/approved-routes', getApprovedRoutes);
router.get('/', listBusRoutes);
router.get('/:id', getBusRoute);
router.post('/', createBusRoute);
router.patch('/:id/status', updateBusRouteStatus);
router.delete('/:id', deleteBusRoute);

export default router;
