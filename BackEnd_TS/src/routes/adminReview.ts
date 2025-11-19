import { Router } from 'express';
import {
  getAdminReviews,
  getAdminReviewById,
  updateAdminReview,
  deleteAdminReview,
  toggleAdminReviewVisibility,
} from '../controllers/review';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Admin Reviews
 *   description: Admin review management endpoints
 */

// All routes require authentication and admin role
router.get('/list', authenticateToken, requireAdmin, getAdminReviews);
router.get('/:id', authenticateToken, requireAdmin, getAdminReviewById);
router.put('/:id', authenticateToken, requireAdmin, updateAdminReview);
router.delete('/:id', authenticateToken, requireAdmin, deleteAdminReview);
router.patch('/:id/toggle-visibility', authenticateToken, requireAdmin, toggleAdminReviewVisibility);

export default router;
