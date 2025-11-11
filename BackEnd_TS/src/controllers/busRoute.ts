import { Request, Response } from 'express';
import { BusRouteService } from '../services/BusRouteService';

/**
 * @swagger
 * /api/bus-routes:
 *   get:
 *     summary: Get list of bus routes (Company's routes)
 *     tags: [BusRoutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by route location name
 *     responses:
 *       200:
 *         description: List of bus routes retrieved successfully
 *       500:
 *         description: Server error
 */
export const listBusRoutes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status === 'true' ? true : req.query.status === 'false' ? false : undefined;
    const search = req.query.search as string;
    const user = (req as any).user;

    const result = await BusRouteService.listBusRoutes(
      user.companyId,
      page,
      pageSize,
      status,
      search
    );

    res.json({
      success: true,
      message: 'Lấy danh sách tuyến xe thành công',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách tuyến xe',
    });
  }
};

/**
 * @swagger
 * /api/bus-routes/{id}:
 *   get:
 *     summary: Get bus route by ID
 *     tags: [BusRoutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bus Route ID
 *     responses:
 *       200:
 *         description: Bus route retrieved successfully
 *       404:
 *         description: Bus route not found
 *       500:
 *         description: Server error
 */
export const getBusRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const busRoute = await BusRouteService.getBusRouteById(id, user.companyId);

    res.json({
      success: true,
      message: 'Lấy thông tin tuyến xe thành công',
      data: busRoute,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy tuyến xe',
    });
  }
};

/**
 * @swagger
 * /api/bus-routes:
 *   post:
 *     summary: Company creates new bus route (selects from approved routes)
 *     tags: [BusRoutes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *             properties:
 *               routeId:
 *                 type: string
 *                 format: uuid
 *                 example: "6c9a0003-49bb-4e46-9366-99c0b0906677"
 *               status:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Bus route created successfully
 *       400:
 *         description: Route not approved or already exists
 *       500:
 *         description: Server error
 */
export const createBusRoute = async (req: Request, res: Response) => {
  try {
    const { routeId, status } = req.body;
    const user = (req as any).user;

    if (!routeId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin tuyến đường',
      });
    }

    const busRoute = await BusRouteService.createBusRoute({
      routeId,
      busCompanyId: user.companyId,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Thêm tuyến xe thành công',
      data: busRoute,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi thêm tuyến xe',
    });
  }
};

/**
 * @swagger
 * /api/bus-routes/{id}/status:
 *   patch:
 *     summary: Company updates bus route status (active/inactive)
 *     tags: [BusRoutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bus Route ID
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
 *                 example: true
 *     responses:
 *       200:
 *         description: Bus route status updated successfully
 *       400:
 *         description: Bus route not found or no permission
 *       500:
 *         description: Server error
 */
export const updateBusRouteStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = (req as any).user;

    if (status === undefined || typeof status !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ',
      });
    }

    const busRoute = await BusRouteService.updateBusRouteStatus(
      id,
      user.companyId,
      status
    );

    res.json({
      success: true,
      message: `Đã ${status ? 'kích hoạt' : 'vô hiệu hóa'} tuyến xe`,
      data: busRoute,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái tuyến xe',
    });
  }
};

/**
 * @swagger
 * /api/bus-routes/{id}:
 *   delete:
 *     summary: Company deletes bus route
 *     tags: [BusRoutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bus Route ID
 *     responses:
 *       200:
 *         description: Bus route deleted successfully
 *       400:
 *         description: Cannot delete (has trips) or not found
 *       500:
 *         description: Server error
 */
export const deleteBusRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const result = await BusRouteService.deleteBusRoute(id, user.companyId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xóa tuyến xe',
    });
  }
};

/**
 * @swagger
 * /api/bus-routes/approved-routes:
 *   get:
 *     summary: Get list of approved routes for company to select
 *     tags: [BusRoutes]
 *     security:
 *       - bearerAuth: []
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
 *           default: 100
 *     responses:
 *       200:
 *         description: List of approved routes
 *       500:
 *         description: Server error
 */
export const getApprovedRoutes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 100;

    const result = await BusRouteService.getApprovedRoutes(page, pageSize);

    res.json({
      success: true,
      message: 'Lấy danh sách tuyến đường đã duyệt thành công',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách tuyến đường',
    });
  }
};
