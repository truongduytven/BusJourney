import { Router } from 'express';
const router = Router();
import userController from '../controllers/user';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip search and management endpoints
 */
router.get('/:roleName', authenticateToken, requireAdmin, userController.getListUsers);

export default router;
