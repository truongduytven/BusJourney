import { Request, Response } from 'express'
import TripService from '../services/TripService'

class TripController {
  /**
   * @openapi
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
   * @openapi
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
   * @openapi
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

  /**
   * @openapi
   * /trips/{id}/coupons:
   *   get:
   *     summary: Get trip coupons by trip ID
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
   *         description: Trip coupons
   *       404:
   *         description: Trip not found
   *       500:
   *         description: Server error
   */
  async getTripCoupons(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await TripService.getTripCoupons(id)
      
      if (!result) {
        return res.status(404).json({ message: 'Trip not found' })
      }

      res.json({
        message: 'Lấy danh sách mã giảm giá thành công',
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
   * /trips/{id}/points:
   *   get:
   *     summary: Get trip pickup/dropoff points by trip ID
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
   *         description: Trip points
   *       404:
   *         description: Trip not found
   *       500:
   *         description: Server error
   */
  async getTripPoints(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await TripService.getTripPoints(id)
      
      if (!result) {
        return res.status(404).json({ message: 'Trip not found' })
      }

      res.json({
        message: 'Lấy điểm đón/trả thành công',
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
   * /trips/{id}/ratings:
   *   get:
   *     summary: Get trip ratings by trip ID with filters and pagination
   *     tags: [Trips]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Trip ID
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number (default 1)
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *         description: Items per page (default 5)
   *       - in: query
   *         name: filterType
   *         schema:
   *           type: string
   *           enum: [all, withComment, withImage]
   *         description: Filter type (default all)
   *       - in: query
   *         name: starRatings
   *         schema:
   *           type: string
   *         description: Comma-separated star ratings (e.g., "4,5")
   *     responses:
   *       200:
   *         description: Trip ratings
   *       404:
   *         description: Trip not found
   *       500:
   *         description: Server error
   */
  async getTripRatings(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { page, pageSize, filterType, starRatings } = req.query

      const params = {
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 5,
        filterType: (filterType as 'all' | 'withComment' | 'withImage') || 'all',
        starRatings: starRatings ? (starRatings as string).split(',').map(Number) : []
      }

      const result = await TripService.getTripRatings(id, params)
      
      if (!result) {
        return res.status(404).json({ message: 'Trip not found' })
      }

      res.json({
        message: 'Lấy đánh giá thành công',
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
   * /trips/{id}/policies:
   *   get:
   *     summary: Get trip policies by trip ID
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
   *         description: Trip policies
   *       404:
   *         description: Trip not found
   *       500:
   *         description: Server error
   */
  async getTripPolicies(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await TripService.getTripPolicies(id)
      
      if (!result) {
        return res.status(404).json({ message: 'Trip not found' })
      }

      res.json({
        message: 'Lấy chính sách thành công',
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
   * /trips/{id}/images:
   *   get:
   *     summary: Get trip images by trip ID
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
   *         description: Trip images
   *       404:
   *         description: Trip not found
   *       500:
   *         description: Server error
   */
  async getTripImages(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await TripService.getTripImages(id)
      
      if (!result) {
        return res.status(404).json({ message: 'Trip not found' })
      }

      res.json({
        message: 'Lấy hình ảnh thành công',
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
   * /trips/{id}/extensions:
   *   get:
   *     summary: Get trip extensions/utilities by trip ID
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
   *         description: Trip extensions
   *       404:
   *         description: Trip not found
   *       500:
   *         description: Server error
   */
  async getTripExtensions(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await TripService.getTripExtensions(id)
      
      if (!result) {
        return res.status(404).json({ message: 'Trip not found' })
      }

      res.json({
        message: 'Lấy tiện ích thành công',
        data: result
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
