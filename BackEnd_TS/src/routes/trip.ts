import express from 'express';
const router = express.Router();
import tripController from '../controllers/trip';

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip search and management endpoints
 */

router.post("/search", tripController.searchTrips);
router.get("/:id", tripController.getTripById);
router.get("/seats/:id", tripController.getTripSeatsById);

export default router;