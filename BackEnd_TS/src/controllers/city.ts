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
}

export default new CityController();

// Export for backward compatibility
export const { getAllCities } = new CityController();
