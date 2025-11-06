import { Request, Response } from 'express';
import LocationService from '../services/LocationService';

/**
 * @swagger
 * /api/locations/list:
 *   get:
 *     summary: Get paginated list of locations
 *     tags: [Locations]
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
 *         description: Search by location name
 *       - in: query
 *         name: cityId
 *         schema:
 *           type: string
 *         description: Filter by city ID
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
 *         description: List of locations retrieved successfully
 *       500:
 *         description: Server error
 */
export const getListLocations = async (req: Request, res: Response) => {
  try {
    const { isActive, search, cityId, pageSize, pageNumber } = req.query;

    const filters = {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search: search as string,
      cityId: cityId as string,
      pageSize: pageSize ? parseInt(pageSize as string) : 10,
      pageNumber: pageNumber ? parseInt(pageNumber as string) : 1,
    };

    const result = await LocationService.getListLocations(filters);

    res.status(200).json({
      message: 'Locations retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error retrieving locations',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location retrieved successfully
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
export const getLocationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const location = await LocationService.getLocationById(id);

    res.status(200).json({
      message: 'Location retrieved successfully',
      data: location,
    });
  } catch (error: any) {
    if (error.message === 'Location not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error retrieving location',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create new location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cityId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bến xe Miền Đông"
 *               cityId:
 *                 type: string
 *                 example: "uuid-city-id"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Location created successfully
 *       400:
 *         description: Location already exists
 *       500:
 *         description: Server error
 */
export const createLocation = async (req: Request, res: Response) => {
  try {
    const { name, cityId, isActive } = req.body;

    if (!name || !cityId) {
      return res.status(400).json({
        message: 'Name and cityId are required',
      });
    }

    const location = await LocationService.createLocation({
      name,
      cityId,
      isActive,
    });

    res.status(201).json({
      message: 'Location created successfully',
      data: location,
    });
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error creating location',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/locations/{id}:
 *   put:
 *     summary: Update location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cityId:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, cityId, isActive } = req.body;

    const location = await LocationService.updateLocation(id, {
      name,
      cityId,
      isActive,
    });

    res.status(200).json({
      message: 'Location updated successfully',
      data: location,
    });
  } catch (error: any) {
    if (error.message === 'Location not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes('already exists')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error updating location',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/locations/{id}:
 *   delete:
 *     summary: Delete location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await LocationService.deleteLocation(id);

    res.status(200).json({
      message: 'Location deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Location not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error deleting location',
        error: error.message,
      });
    }
  }
};
