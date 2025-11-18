import express from 'express'
import {
  listCompanyTripPoints,
  getTripPointById,
  createTripPoint,
  updateTripPoint,
  deleteTripPoint,
  toggleTripPointStatus
} from '../controllers/companyTripPoint'

const router = express.Router()

/**
 * @swagger
 * /api/company-trip-points/company:
 *   get:
 *     summary: Lấy danh sách điểm đón/trả của công ty
 *     tags: [Company Trip Points]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: tripId
 *         schema:
 *           type: string
 *       - in: query
 *         name: pointId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [pickup, dropoff]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/company', listCompanyTripPoints)

/**
 * @swagger
 * /api/company-trip-points/company/{id}:
 *   get:
 *     summary: Lấy chi tiết điểm đón/trả
 *     tags: [Company Trip Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/company/:id', getTripPointById)

/**
 * @swagger
 * /api/company-trip-points/company:
 *   post:
 *     summary: Tạo điểm đón/trả mới
 *     tags: [Company Trip Points]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tripId
 *               - time
 *             properties:
 *               tripId:
 *                 type: string
 *               pointId:
 *                 type: string
 *               pointData:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [pickup, dropoff]
 *                   locationName:
 *                     type: string
 *               time:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/company', createTripPoint)

/**
 * @swagger
 * /api/company-trip-points/company/{id}:
 *   put:
 *     summary: Cập nhật điểm đón/trả
 *     tags: [Company Trip Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *               pointId:
 *                 type: string
 *               time:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/company/:id', updateTripPoint)

/**
 * @swagger
 * /api/company-trip-points/company/{id}:
 *   delete:
 *     summary: Xóa điểm đón/trả
 *     tags: [Company Trip Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.delete('/company/:id', deleteTripPoint)

/**
 * @swagger
 * /api/company-trip-points/company/{id}/toggle:
 *   put:
 *     summary: Bật/tắt trạng thái điểm đón/trả
 *     tags: [Company Trip Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/company/:id/toggle', toggleTripPointStatus)

export default router
