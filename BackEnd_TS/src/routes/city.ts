import express from 'express';
const router = express.Router();
import { getAllCities } from "../controllers/city";

/**
 * @openapi
 * /cities:
 *   get:
 *     summary: Get all cities
 *     tags:
 *       - Cities
 *     responses:
 *       200:
 *         description: List of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 */
router.get("/", getAllCities);

export default router;