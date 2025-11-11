import { Request, Response } from 'express';
import { RouteService } from '../services/RouteService';

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Get list of routes (Admin & Company can view)
 *     tags: [Routes]
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
 *     responses:
 *       200:
 *         description: List of routes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Server error
 */
// Lấy danh sách routes
export const listRoutes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const result = await RouteService.listRoutes(page, pageSize);

    res.json({
      success: true,
      message: 'Lấy danh sách tuyến đường thành công',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách tuyến đường'
    });
  }
};

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     summary: Get route by ID
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: Route not found
 *       500:
 *         description: Server error
 */
// Lấy chi tiết route
export const getRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const route = await RouteService.getRouteById(id);

    res.json({
      success: true,
      message: 'Lấy thông tin tuyến đường thành công',
      data: route
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy tuyến đường'
    });
  }
};

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Company creates route request (status = Pending)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startLocationId
 *               - endLocationId
 *               - distance
 *             properties:
 *               startLocationId:
 *                 type: string
 *                 format: uuid
 *                 example: "4cbe1193-5023-43b7-98aa-c654d1946d4"
 *               endLocationId:
 *                 type: string
 *                 format: uuid
 *                 example: "a47df6bb-9cb7-48d7-a22b-cea0e66778c9"
 *               distance:
 *                 type: number
 *                 example: 1700
 *                 description: Distance in kilometers
 *     responses:
 *       201:
 *         description: Route request created successfully (Pending status)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing required fields or route already exists
 *       500:
 *         description: Server error
 */
// Company tạo yêu cầu route mới (status = Pending)
export const createRouteAsCompany = async (req: Request, res: Response) => {
  try {
    const { startLocationId, endLocationId, distance } = req.body;
    const user = (req as any).user;

    if (!startLocationId || !endLocationId || !distance) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const route = await RouteService.createRoute({
      startLocationId,
      endLocationId,
      distance: parseFloat(distance),
      status: 'Pending',
      createdBy: user?.accountId
    });

    res.status(201).json({
      success: true,
      message: 'Yêu cầu tạo tuyến đường đã được gửi (Pending)',
      data: route
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo yêu cầu tuyến đường'
    });
  }
};

/**
 * @swagger
 * /api/routes/admin-create:
 *   post:
 *     summary: Admin creates route directly (status = Approved)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startLocationId
 *               - endLocationId
 *               - distance
 *             properties:
 *               startLocationId:
 *                 type: string
 *                 format: uuid
 *                 example: "4cbe1193-5023-43b7-98aa-c654d1946d4"
 *               endLocationId:
 *                 type: string
 *                 format: uuid
 *                 example: "a47df6bb-9cb7-48d7-a22b-cea0e66778c9"
 *               distance:
 *                 type: number
 *                 example: 1700
 *                 description: Distance in kilometers
 *     responses:
 *       201:
 *         description: Route created successfully (Approved status)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing required fields or route already exists
 *       500:
 *         description: Server error
 */
// Admin tạo route mới (status = Approved)
export const createRouteAsAdmin = async (req: Request, res: Response) => {
  try {
    const { startLocationId, endLocationId, distance } = req.body;
    const user = (req as any).user;

    if (!startLocationId || !endLocationId || !distance) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const route = await RouteService.createRoute({
      startLocationId,
      endLocationId,
      distance: parseFloat(distance),
      status: 'Approved',
      createdBy: user?.accountId
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tuyến đường thành công (Approved)',
      data: route
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo tuyến đường'
    });
  }
};

/**
 * @swagger
 * /api/routes/{id}/status:
 *   patch:
 *     summary: Admin updates route status (Approve/Reject/Pending)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Route ID
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
 *                 type: string
 *                 enum: [Approved, Rejected, Pending]
 *                 example: "Approved"
 *     responses:
 *       200:
 *         description: Route status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid status or route not found
 *       500:
 *         description: Server error
 */
// Admin cập nhật status route
export const updateRouteStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status không hợp lệ. Chỉ chấp nhận: Approved, Rejected, Pending'
      });
    }

    const route = await RouteService.updateRouteStatus(id, status);

    res.json({
      success: true,
      message: `Đã ${status === 'Approved' ? 'duyệt' : status === 'Rejected' ? 'từ chối' : 'cập nhật'} tuyến đường`,
      data: route
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái tuyến đường'
    });
  }
};

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     summary: Admin deletes route
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Route not found
 *       500:
 *         description: Server error
 */
// Admin xóa route
export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await RouteService.deleteRoute(id);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xóa tuyến đường'
    });
  }
};

/**
 * @swagger
 * /api/routes/bulk-update-status:
 *   post:
 *     summary: Admin bulk updates status of multiple routes
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
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
 *                 example: ["6c9a0003-49bb-4e46-9366-99c0b0906677", "c0619f84-7768-4319-b1dd-d9a63deda564"]
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected, Pending]
 *                 example: "Approved"
 *     responses:
 *       200:
 *         description: Routes status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid IDs or status
 *       500:
 *         description: Server error
 */
// Admin bulk update status nhiều routes
export const bulkUpdateRouteStatus = async (req: Request, res: Response) => {
  try {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Danh sách ID không hợp lệ'
      });
    }

    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status không hợp lệ. Chỉ chấp nhận: Approved, Rejected, Pending'
      });
    }

    const result = await RouteService.bulkUpdateRouteStatus(ids, status);

    res.json({
      success: true,
      message: `Đã ${status === 'Approved' ? 'duyệt' : status === 'Rejected' ? 'từ chối' : 'cập nhật'} ${result.count} tuyến đường`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật hàng loạt trạng thái tuyến đường'
    });
  }
};
