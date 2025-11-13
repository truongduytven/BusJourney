import express from 'express';
import {
  getListStaff,
  getStaffById,
  createStaff,
  updateStaff,
  toggleStaffStatus,
  bulkToggleActive,
} from '../controllers/staff';
import { authenticateToken, requireCompany } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Staffs
 *   description: Staff management endpoints
 */

// All routes require authentication and company role
router.use(authenticateToken);
router.use(requireCompany);

// Staff management routes
router.get('/list', getListStaff);
router.get('/:id', getStaffById);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.put('/bulk-toggle-active', bulkToggleActive);
router.patch('/:id/toggle-status', toggleStaffStatus);

export default router;
