import { Router } from 'express';
import {
  getListPoints,
  getPointById,
  createPoint,
  updatePoint,
  deletePoint,
} from '../controllers/point';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();


/**
 * @openapi
 * tags:
 *   name: Points
 *   description: Point management endpoints
 */

// Public routes
router.get('/list', getListPoints);
router.get('/:id', getPointById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireAdmin, createPoint);
router.put('/:id', authenticateToken, requireAdmin, updatePoint);
router.delete('/:id', authenticateToken, requireAdmin, deletePoint);

export default router;
