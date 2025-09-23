import express from 'express';
const router = express.Router();
import tripController from '../controllers/trip';

/**
 * @openapi
 * /trips/search:
 *   post:
 *     summary: Search trips
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: minPrice
 *         schema:   
 *           type: number
 *           format: float
 *         required: false
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         required: false
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *     requestBody:
 *         description: Trip search criteria
 *         required: true
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  fromCityId:
 *                    type: string
 *                  toCityId:
 *                    type: string
 *                  departureDate:
 *                    type: string
 *                  typeBus:
 *                    type: array
 *                    items:
 *                      type: string
 *                  companiesId:
 *                    type: array
 *                    items:
 *                      type: string
 *     responses:
 *       200:
 *         description: List of trips
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
router.post("/search", tripController.searchTrips);

export default router;