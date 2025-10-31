import express from 'express';
const router = express.Router();
import { getAllCities } from "../controllers/city";

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: City management endpoints
 */

router.get("/", getAllCities);

export default router;