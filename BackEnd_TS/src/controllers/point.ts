import { Request, Response } from 'express';
import PointService from '../services/PointService';

/**
 * @openapi
 * /api/points/list:
 *   get:
 *     summary: Get paginated list of points
 *     tags: [Points]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by point location
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [pickup, dropoff]
 *         description: Filter by point type
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of points retrieved successfully
 *       500:
 *         description: Server error
 */
export const getListPoints = async (req: Request, res: Response) => {
  try {
    const { isActive, search, type, pageSize, pageNumber } = req.query;

    const filters = {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search: search as string,
      type: type as string,
      pageSize: pageSize ? parseInt(pageSize as string) : 10,
      pageNumber: pageNumber ? parseInt(pageNumber as string) : 1,
    };

    const result = await PointService.getListPoints(filters);

    res.status(200).json({
      message: 'Points retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error retrieving points',
      error: error.message,
    });
  }
};

/**
 * @openapi
 * /api/points/{id}:
 *   get:
 *     summary: Get point by ID
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Point ID
 *     responses:
 *       200:
 *         description: Point retrieved successfully
 *       404:
 *         description: Point not found
 *       500:
 *         description: Server error
 */
export const getPointById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const point = await PointService.getPointById(id);

    res.status(200).json({
      message: 'Point retrieved successfully',
      data: point,
    });
  } catch (error: any) {
    if (error.message === 'Point not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error retrieving point',
        error: error.message,
      });
    }
  }
};

/**
 * @openapi
 * /api/points:
 *   post:
 *     summary: Create new point
 *     tags: [Points]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationName
 *               - type
 *             properties:
 *               locationName:
 *                 type: string
 *                 example: "Bến xe Miền Đông"
 *               type:
 *                 type: string
 *                 enum: [pickup, dropoff]
 *                 example: "pickup"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Point created successfully
 *       400:
 *         description: Point already exists or validation error
 *       500:
 *         description: Server error
 */
export const createPoint = async (req: Request, res: Response) => {
  try {
    const { locationName, type, isActive } = req.body;

    if (!locationName || !type) {
      return res.status(400).json({
        message: 'LocationName and type are required',
      });
    }

    const point = await PointService.createPoint({
      locationName,
      type,
      isActive,
    });

    res.status(201).json({
      message: 'Point created successfully',
      data: point,
    });
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error creating point',
        error: error.message,
      });
    }
  }
};

/**
 * @openapi
 * /api/points/{id}:
 *   put:
 *     summary: Update point
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Point ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locationName:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [pickup, dropoff]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Point updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Point not found
 *       500:
 *         description: Server error
 */
export const updatePoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { locationName, type, isActive } = req.body;

    const point = await PointService.updatePoint(id, {
      locationName,
      type,
      isActive,
    });

    res.status(200).json({
      message: 'Point updated successfully',
      data: point,
    });
  } catch (error: any) {
    if (error.message === 'Point not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes('already exists')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error updating point',
        error: error.message,
      });
    }
  }
};

/**
 * @openapi
 * /api/points/{id}:
 *   delete:
 *     summary: Delete point
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Point ID
 *     responses:
 *       200:
 *         description: Point deleted successfully
 *       404:
 *         description: Point not found
 *       500:
 *         description: Server error
 */
export const deletePoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await PointService.deletePoint(id);

    res.status(200).json({
      message: 'Point deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Point not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error deleting point',
        error: error.message,
      });
    }
  }
};
