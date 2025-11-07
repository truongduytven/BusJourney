import express from 'express';
const router = express.Router();
import partnerController from "../controllers/partner";
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Partner registration and management endpoints
 */

// Public endpoint - no authentication required
router.post("/register", partnerController.registerPartner);

// Admin endpoints - authentication required
router.get("/", authenticateToken, requireAdmin, partnerController.getListPartners);
router.get("/stats", authenticateToken, requireAdmin, partnerController.getPartnerStats);
router.get("/:id", authenticateToken, requireAdmin, partnerController.getPartnerById);
router.patch("/:id/status", authenticateToken, requireAdmin, partnerController.updatePartnerStatus);
router.delete("/:id", authenticateToken, requireAdmin, partnerController.deletePartner);

export default router;
