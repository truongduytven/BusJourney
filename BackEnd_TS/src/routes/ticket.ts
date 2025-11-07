import { Router } from 'express';
import { lookupTicket } from '../controllers/ticket';
import myTicketController from '../controllers/myTicket';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket lookup and management endpoints
 */

// Public routes
router.post('/lookup', lookupTicket);

// Protected routes - My Tickets
router.get('/my-tickets', authenticateToken, myTicketController.getMyTickets);
router.get('/:id/detail', authenticateToken, myTicketController.getTicketDetail);

export default router;