import { Request, Response } from 'express'
import CityService from '../services/CityService'

class CityController {
  /**
   * @swagger
   * /cities:
   *   get:
   *     summary: Get all cities
   *     tags: [Cities]
   *     responses:
   *       200:
   *         description: List of cities
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       name:
   *                         type: string
   *       500:
   *         description: Server error
   */
  async getAllCities(req: Request, res: Response) {
    try {
      const result = await CityService.getAllCities()
      res.status(200).json({
        message: 'Lấy danh sách thành phố thành công',
        data: result.data,
        success: true
      })
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
        message: 'Lỗi server',
        success: false
      })
    }
  }

  /**
   * @openapi
   * /cities/list:
   *   get:
   *     summary: Get cities list with pagination and filters
   *     tags: [Cities]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         required: false
   *         description: Search by city name
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *         required: false
   *         description: Filter by active status
   *       - in: query
   *         name: pageNumber
   *         schema:
   *           type: integer
   *           default: 1
   *         required: true
   *         description: Page number (starts from 1)
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 10
   *         required: true
   *         description: Number of cities per page
   *     responses:
   *       200:
   *         description: City list retrieved successfully
   *       400:
   *         description: Invalid parameters
   *       500:
   *         description: Server error
   */
  async getListCities(req: Request, res: Response) {
    try {
      const { search, isActive, pageNumber, pageSize } = req.query

      if (!pageNumber || !pageSize) {
        return res.status(400).json({
          message: 'pageNumber and pageSize are required'
        })
      }

      const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined

      const result = await CityService.getListCities({
        search: search as string | undefined,
        isActive: isActiveBool,
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize)
      })

      res.json({
        message: 'Lấy danh sách thành phố thành công',
        data: result
      })
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }

  /**
   * @openapi
   * /cities/{id}:
   *   get:
   *     summary: Get city by ID
   *     tags: [Cities]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: City retrieved successfully
   *       404:
   *         description: City not found
   *       500:
   *         description: Server error
   */
  async getCityById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const city = await CityService.getCityById(id)

      res.json({
        message: 'Lấy thông tin thành phố thành công',
        data: city
      })
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({
          message: err.message
        })
      }
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }

  /**
   * @openapi
   * /cities:
   *   post:
   *     summary: Create a new city
   *     tags: [Cities]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *               isActive:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: City created successfully
   *       400:
   *         description: Invalid input or city already exists
   *       500:
   *         description: Server error
   */
  async createCity(req: Request, res: Response) {
    try {
      const { name, isActive } = req.body

      if (!name) {
        return res.status(400).json({
          message: 'Tên thành phố là bắt buộc'
        })
      }

      const newCity = await CityService.createCity({
        name,
        isActive: isActive ?? true
      })

      res.status(201).json({
        message: 'Tạo thành phố thành công',
        data: newCity
      })
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        return res.status(400).json({
          message: err.message
        })
      }
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }

  /**
   * @openapi
   * /cities/{id}:
   *   put:
   *     summary: Update city
   *     tags: [Cities]
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
   *               name:
   *                 type: string
   *               isActive:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: City updated successfully
   *       404:
   *         description: City not found
   *       500:
   *         description: Server error
   */
  async updateCity(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, isActive } = req.body

      const updatedCity = await CityService.updateCity(id, {
        name,
        isActive
      })

      res.json({
        message: 'Cập nhật thành phố thành công',
        data: updatedCity
      })
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({
          message: err.message
        })
      }
      if (err.message.includes('already exists')) {
        return res.status(400).json({
          message: err.message
        })
      }
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }

  /**
   * @openapi
   * /cities/{id}:
   *   delete:
   *     summary: Delete city
   *     tags: [Cities]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: City deleted successfully
   *       404:
   *         description: City not found
   *       500:
   *         description: Server error
   */
  async deleteCity(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await CityService.deleteCity(id)

      res.json(result)
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({
          message: err.message
        })
      }
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }
}

export default new CityController();

// Export for backward compatibility
export const { getAllCities } = new CityController();
