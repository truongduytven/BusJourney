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
router.get("/seats/:id", tripController.getTripSeatsById);
router.get("/:id/coupons", tripController.getTripCoupons);
router.get("/:id/points", tripController.getTripPoints);
router.get("/:id/ratings", tripController.getTripRatings);
router.get("/:id/policies", tripController.getTripPolicies);
router.get("/:id/images", tripController.getTripImages);
router.get("/:id/extensions", tripController.getTripExtensions);
router.get("/:id", tripController.getTripById);

export default router;