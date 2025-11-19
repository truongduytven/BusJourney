import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireAdmin, requireCompany } from '../middlewares/authMiddleware';
import {
  listRoutes,
  getRoute,
  createRouteAsCompany,
  createRouteAsAdmin,
  updateRouteStatus,
  deleteRoute,
  bulkUpdateRouteStatus
} from '../controllers/route';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Routes
 *   description: Route management endpoints
 */

router.use(authenticateToken);
router.get('/', listRoutes);
router.get('/:id', getRoute);
router.post('/', requireCompany, createRouteAsCompany);
router.post('/admin-create', requireAdmin, createRouteAsAdmin);
router.patch('/:id/status', requireAdmin, updateRouteStatus);
router.post('/bulk-update-status', requireAdmin, bulkUpdateRouteStatus);
router.delete('/:id', requireAdmin, deleteRoute);

export default router;
