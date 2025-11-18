import { Router } from 'express';
import { 
  getCompanyTickets,
  getCompanyTicketById,
  updateCompanyTicket,
  deleteCompanyTicket,
  toggleCompanyTicketStatus,
  checkInTicket,
} from '../controllers/ticket';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Company - Tickets
 *   description: Company ticket management endpoints
 */

// Company ticket management routes
router.get('/company/list', authenticateToken, getCompanyTickets);
router.get('/company/:id', authenticateToken, getCompanyTicketById);
router.put('/company/:id', authenticateToken, updateCompanyTicket);
router.delete('/company/:id', authenticateToken, deleteCompanyTicket);
router.patch('/company/:id/toggle-status', authenticateToken, toggleCompanyTicketStatus);
router.post('/company/:id/check-in', authenticateToken, checkInTicket);

export default router;
