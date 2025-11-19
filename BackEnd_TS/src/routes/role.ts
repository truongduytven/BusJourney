import { Router } from 'express';
const router = Router();
import roleController from '../controllers/role';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

/**
 * @openapi
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */
router.get('/', authenticateToken, requireAdmin, roleController.getAllRoles);

export default router;
