import { Router } from 'express';
const router = Router();
import userController from '../controllers/user';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
router.get('/', authenticateToken, requireAdmin, userController.getListUsers);

export default router;
