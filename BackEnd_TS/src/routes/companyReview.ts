import { Router } from 'express';
import {
  getCompanyReviews,
  getCompanyReviewById,
  updateCompanyReview,
  deleteCompanyReview,
} from '../controllers/review';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Company Reviews
 *   description: Company review management endpoints
 */

// All routes require authentication (company role checked via companyId)
router.get('/list', authenticateToken, getCompanyReviews);
router.get('/:id', authenticateToken, getCompanyReviewById);
router.put('/:id', authenticateToken, updateCompanyReview);
router.delete('/:id', authenticateToken, deleteCompanyReview);

export default router;
