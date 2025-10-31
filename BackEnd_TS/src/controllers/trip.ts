import { Request, Response } from 'express'
import TripService from '../services/TripService'

class TripController {
  /**
   * @swagger
   * /trips/search:
   *   post:
   *     summary: Search trips
   *     tags: [Trips]
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
   *       description: Trip search criteria
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fromCityId:
   *                 type: string
   *               toCityId:
   *                 type: string
   *               departureDate:
   *                 type: string
   *               typeBus:
   *                 type: array
   *                 items:
   *                   type: string
   *               companiesId:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: List of trips
   *       400:
   *         description: Missing required parameters
   *       500:
   *         description: Server error
   */
  async searchTrips(req: Request, res: Response) {
    try {
      const { pageNumber = 1, pageSize = 10, minPrice, maxPrice, sort = 'default' } = req.query
      const { fromCityId, toCityId, departureDate, typeBus, companiesId } = req.body

      if (!fromCityId || !toCityId || !departureDate) {
        return res.status(400).json({
          message: 'fromCityId, toCityId và departureDate là bắt buộc'
        })
      }

      const result = await TripService.searchTrips({
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort as string,
        fromCityId,
        toCityId,
        departureDate,
        typeBus,
        companiesId
      })

      res.status(200).json({
        message: 'Danh sách chuyến xe',
        ...result
      })
    } catch (err: any) {
      console.error(err)
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }

  /**
   * @swagger
   * /trips/{id}:
   *   get:
   *     summary: Get trip details by ID
   *     tags: [Trips]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Trip ID
   *     responses:
   *       200:
   *         description: Trip details
   *       400:
   *         description: Trip ID is required
   *       404:
   *         description: Trip not found
   *       500:
   *         description: Server error
   */
  async getTripById(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({
          message: 'Trip ID is required'
        })
      }

      const tripResult = await TripService.getTripById(id)
      
      if (!tripResult) {
        return res.status(404).json({
          message: 'Trip not found'
        })
      }

      res.json({
        message: 'Lấy chi tiết chuyến xe thành công',
        data: tripResult
      })
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }

  /**
   * @swagger
   * /trips/seats/{id}:
   *   get:
   *     summary: Get trip seats by trip ID
   *     tags: [Trips]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Trip ID
   *     responses:
   *       200:
   *         description: Trip seats information
   *       400:
   *         description: Trip ID is required
   *       404:
   *         description: Trip not found
   *       500:
   *         description: Server error
   */
  async getTripSeatsById(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({
          message: 'Trip ID is required'
        })
      }

      const tripResult = await TripService.getTripSeatsById(id)
      
      if (!tripResult) {
        return res.status(404).json({
          message: 'Trip not found'
        })
      }

      res.json({
        message: 'Lấy danh sách ghế thành công',
        data: tripResult
      })
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }
}

export default new TripController()
