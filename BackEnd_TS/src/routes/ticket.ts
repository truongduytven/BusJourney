import { Router } from 'express';
import { lookupTicket } from '../controllers/ticket';
import myTicketController from '../controllers/myTicket';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Tickets
 *   description: Ticket lookup and management endpoints
 */

router.post('/lookup', lookupTicket);
router.get('/my-tickets', authenticateToken, myTicketController.getMyTickets);
router.get('/:id/detail', authenticateToken, myTicketController.getTicketDetail);

export default router;