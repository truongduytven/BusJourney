import { Request, Response } from 'express';
import { CompanyTripService } from '../services/CompanyTripService';

export class CompanyTripController {
  /**
   * @swagger
   * /company-trips/company:
   *   get:
   *     summary: Get company's trips
   *     tags: [Company Trips]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: busId
   *         schema:
   *           type: string
   *       - in: query
   *         name: busRouteId
   *         schema:
   *           type: string
   *       - in: query
   *         name: templateId
   *         schema:
   *           type: string
   *       - in: query
   *         name: status
   *         schema:
   *           type: boolean
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyListTrips(req: Request, res: Response) {
    try {
      const {
        page = 1,
        pageSize = 10,
        search,
        busId,
        busRouteId,
        templateId,
        status,
        startDate,
        endDate,
      } = req.query;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe',
        });
      }

      const result = await CompanyTripService.listCompanyTrips(
        Number(page),
        Number(pageSize),
        search as string,
        busId as string,
        busRouteId as string,
        templateId as string,
        status === 'true' ? true : status === 'false' ? false : undefined,
        startDate as string,
        endDate as string,
        companyId
      );

      res.json({
        success: true,
        message: 'Lấy danh sách chuyến đi thành công',
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách chuyến đi',
      });
    }
  }

  /**
   * @swagger
   * /company-trips/company/{id}:
   *   get:
   *     summary: Get company's trip by ID
   *     tags: [Company Trips]
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
  static async companyGetTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe',
        });
      }

      const trip = await CompanyTripService.getTripById(id, companyId);

      res.json({
        success: true,
        message: 'Lấy thông tin chuyến đi thành công',
        data: trip,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin chuyến đi',
      });
    }
  }

  /**
   * @swagger
   * /company-trips/company:
   *   post:
   *     summary: Create new trip
   *     tags: [Company Trips]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - busId
   *               - departureTime
   *               - arrivalTime
   *               - price
   *             properties:
   *               busRoutesId:
   *                 type: string
   *               templateId:
   *                 type: string
   *               busId:
   *                 type: string
   *               departureTime:
   *                 type: string
   *                 format: date-time
   *               arrivalTime:
   *                 type: string
   *                 format: date-time
   *               price:
   *                 type: number
   *               status:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Created
   */
  static async companyCreateTrip(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe',
        });
      }

      const trip = await CompanyTripService.createTrip(req.body);

      res.status(201).json({
        success: true,
        message: 'Tạo chuyến đi thành công',
        data: trip,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo chuyến đi',
      });
    }
  }

  /**
   * @swagger
   * /company-trips/company/bulk:
   *   post:
   *     summary: Create multiple trips
   *     tags: [Company Trips]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - dates
   *               - busId
   *               - departureTime
   *               - arrivalTime
   *               - price
   *             properties:
   *               dates:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: date
   *               busRoutesId:
   *                 type: string
   *               templateId:
   *                 type: string
   *               busId:
   *                 type: string
   *               departureTime:
   *                 type: string
   *               arrivalTime:
   *                 type: string
   *               price:
   *                 type: number
   *               status:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Created
   */
  static async companyCreateBulkTrips(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe',
        });
      }

      const result = await CompanyTripService.createBulkTrips(req.body);

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo chuyến đi hàng loạt',
      });
    }
  }

  /**
   * @swagger
   * /company-trips/company/{id}:
   *   put:
   *     summary: Update trip
   *     tags: [Company Trips]
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
   *               busRoutesId:
   *                 type: string
   *               templateId:
   *                 type: string
   *               busId:
   *                 type: string
   *               departureTime:
   *                 type: string
   *                 format: date-time
   *               arrivalTime:
   *                 type: string
   *                 format: date-time
   *               price:
   *                 type: number
   *               status:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyUpdateTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe',
        });
      }

      const trip = await CompanyTripService.updateTrip(id, req.body, companyId);

      res.json({
        success: true,
        message: 'Cập nhật chuyến đi thành công',
        data: trip,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật chuyến đi',
      });
    }
  }

  /**
   * @swagger
   * /company-trips/company/{id}/toggle:
   *   put:
   *     summary: Toggle trip status
   *     tags: [Company Trips]
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
   *               - status
   *             properties:
   *               status:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyToggleTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe',
        });
      }

      const result = await CompanyTripService.toggleTripStatus(id, status, companyId);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật trạng thái chuyến đi',
      });
    }
  }

  /**
   * @swagger
   * /company-trips/company/bulk-toggle:
   *   put:
   *     summary: Toggle multiple trips status
   *     tags: [Company Trips]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - ids
   *               - status
   *             properties:
   *               ids:
   *                 type: array
   *                 items:
   *                   type: string
   *               status:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyBulkToggleTrip(req: Request, res: Response) {
    try {
      const { ids, status } = req.body;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe',
        });
      }

      const result = await CompanyTripService.bulkToggleTripStatus(ids, status, companyId);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật trạng thái chuyến đi',
      });
    }
  }
}
