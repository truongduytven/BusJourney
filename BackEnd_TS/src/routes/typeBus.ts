import { Router } from 'express';
import typeBusController from '../controllers/typeBus';
import { authenticateToken, requireAdmin, requireCompany } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Admin - TypeBuses
 *     description: Admin type bus management (read-only)
 *   - name: Company - TypeBuses
 *     description: Company type bus management (full CRUD)
 */

router.get('/company', authenticateToken, requireCompany, typeBusController.companyListTypeBuses);
router.get('/company/:id', authenticateToken, requireCompany, typeBusController.companyGetTypeBus);
router.post('/company', authenticateToken, requireCompany, typeBusController.companyCreateTypeBus);
router.put('/company/:id', authenticateToken, requireCompany, typeBusController.companyUpdateTypeBus);
router.delete('/company/:id', authenticateToken, requireCompany, typeBusController.companyDeleteTypeBus);


router.get('/', authenticateToken, requireAdmin, typeBusController.adminListTypeBuses);
router.get('/:id', authenticateToken, requireAdmin, typeBusController.adminGetTypeBus);

export default router;
