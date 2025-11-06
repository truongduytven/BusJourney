import express from 'express';
const router = express.Router();
import cityController from "../controllers/city";
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: City management endpoints
 */

router.get("/", cityController.getAllCities);
router.get("/list", authenticateToken, requireAdmin, cityController.getListCities);
router.get("/:id", authenticateToken, requireAdmin, cityController.getCityById);
router.post("/", authenticateToken, requireAdmin, cityController.createCity);
router.put("/:id", authenticateToken, requireAdmin, cityController.updateCity);
router.delete("/:id", authenticateToken, requireAdmin, cityController.deleteCity);

export default router;