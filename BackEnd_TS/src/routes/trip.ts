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


/**
 * @openapi
 * /trips/{tripId}:
 *   get:
 *     summary: Get trip details by ID
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Trip details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *
 */
router.get("/:id", tripController.getTripById);

/**
 * @openapi
 * /trips/seats/{tripId}:
 *   get:
 *     summary: Get trip seats by trip ID
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Trip details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *
 */
router.get("/seats/:id", tripController.getTripSeatsById);

export default router;