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
router.post('/', authenticateToken, requireAdmin, userController.createUser);
router.get('/:id', authenticateToken, requireAdmin, userController.getUserById);
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser);

export default router;
