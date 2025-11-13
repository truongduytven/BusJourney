import { Router } from 'express';
const router = Router();
import userController from '../controllers/user';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints (for Admins only)
 */

router.get('/', authenticateToken, requireAdmin, userController.getListUsers);
router.post('/', authenticateToken, requireAdmin, upload.single('avatar'), userController.createUser);
router.put('/bulk-toggle-active', authenticateToken, requireAdmin, userController.bulkToggleActive);
router.get('/:id', authenticateToken, requireAdmin, userController.getUserById);
router.put('/:id', authenticateToken, requireAdmin, upload.single('avatar'), userController.updateUser);

export default router;
