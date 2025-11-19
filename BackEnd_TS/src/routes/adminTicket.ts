import { Router } from 'express';
import { 
  getListTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  toggleTicketStatus,
} from '../controllers/ticket';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Admin - Tickets
 *   description: Admin ticket management endpoints
 */

// Admin ticket management routes
router.get('/list', authenticateToken, getListTickets);
router.get('/:id', authenticateToken, getTicketById);
router.put('/:id', authenticateToken, updateTicket);
router.delete('/:id', authenticateToken, deleteTicket);
router.patch('/:id/toggle-status', authenticateToken, toggleTicketStatus);

export default router;
