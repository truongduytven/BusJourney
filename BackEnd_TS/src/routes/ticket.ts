import { Router } from 'express';
import { lookupTicket } from '../controllers/ticket';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket lookup and management endpoints
 */

router.post('/lookup', lookupTicket);

export default router;