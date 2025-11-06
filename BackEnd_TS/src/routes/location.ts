import { Router } from 'express';
import {
  getListLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/location';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Location management endpoints
 */

// Public routes
router.get('/list', getListLocations);
router.get('/:id', getLocationById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireAdmin, createLocation);
router.put('/:id', authenticateToken, requireAdmin, updateLocation);
router.delete('/:id', authenticateToken, requireAdmin, deleteLocation);

export default router;
