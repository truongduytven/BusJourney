import express from 'express';
import { BusController } from '../controllers/bus';
import { authenticateToken } from '../middlewares/authMiddleware';
import upload from '../middlewares/upload';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Buses
 *   description: Bus search and management endpoints
 */

router.get('/company', authenticateToken, BusController.companyListBuses);
router.get('/company/:id', authenticateToken, BusController.companyGetBus);
router.post('/company', authenticateToken, upload.array('images', 10), BusController.companyCreateBus);
router.put('/company/:id', authenticateToken, upload.array('images', 10), BusController.companyUpdateBus);
router.delete('/company/:id', authenticateToken, BusController.companyDeleteBus);

router.get('/', authenticateToken, BusController.adminListBuses);
router.get('/:id', authenticateToken, BusController.adminGetBus);

export default router;
