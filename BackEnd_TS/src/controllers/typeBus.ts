import { Request, Response } from 'express';
import { TypeBusService } from '../services/TypeBusService';

class TypeBusController {
  // ==================== ADMIN ROUTES (Read-only) ====================

  /**
   * @swagger
   * /api/type-buses:
   *   get:
   *     summary: Get list of all type buses (Admin view)
   *     tags: [Admin - TypeBuses]
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
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by name
   *       - in: query
   *         name: isFloors
   *         schema:
   *           type: boolean
   *         description: Filter by floor type (true/false)
   *     responses:
   *       200:
   *         description: List of type buses retrieved successfully
   *       500:
   *         description: Server error
   */
  async adminListTypeBuses(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = req.query.search as string | undefined;
      const isFloors = req.query.isFloors === 'true' ? true : req.query.isFloors === 'false' ? false : undefined;

      // Admin sees all type buses (no company filter)
      const result = await TypeBusService.listTypeBuses(page, pageSize, search, isFloors);

      res.json({
        success: true,
        message: 'Lấy danh sách loại xe thành công',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách loại xe'
      });
    }
  }

  /**
   * @swagger
   * /api/type-buses/{id}:
   *   get:
   *     summary: Get type bus detail (Admin view)
   *     tags: [Admin - TypeBuses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Type bus ID
   *     responses:
   *       200:
   *         description: Type bus retrieved successfully
   *       404:
   *         description: Type bus not found
   *       500:
   *         description: Server error
   */
  async adminGetTypeBus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Admin can view any type bus (no company filter)
      const typeBus = await TypeBusService.getTypeBusById(id);

      res.json({
        success: true,
        message: 'Lấy thông tin loại xe thành công',
        data: typeBus
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Không tìm thấy loại xe'
      });
    }
  }

  // ==================== COMPANY ROUTES (Full CRUD) ====================

  /**
   * @swagger
   * /api/company/type-buses:
   *   get:
   *     summary: Get list of company's type buses
   *     tags: [Company - TypeBuses]
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
   *           default: 10
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: isFloors
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: List retrieved successfully
   *       403:
   *         description: Permission denied
   *       500:
   *         description: Server error
   */
  async companyListTypeBuses(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = req.query.search as string | undefined;
      const isFloors = req.query.isFloors === 'true' ? true : req.query.isFloors === 'false' ? false : undefined;

      const user = (req as any).user;
      const busCompanyId = user?.companyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      // Company only sees their own type buses
      const result = await TypeBusService.listTypeBuses(page, pageSize, search, isFloors, busCompanyId);

      res.json({
        success: true,
        message: 'Lấy danh sách loại xe thành công',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách loại xe'
      });
    }
  }

  /**
   * @swagger
   * /api/company/type-buses/{id}:
   *   get:
   *     summary: Get company's type bus detail
   *     tags: [Company - TypeBuses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Type bus retrieved
   *       403:
   *         description: Permission denied
   *       404:
   *         description: Not found
   */
  async companyGetTypeBus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const busCompanyId = user?.companyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const typeBus = await TypeBusService.getTypeBusById(id, busCompanyId);

      res.json({
        success: true,
        message: 'Lấy thông tin loại xe thành công',
        data: typeBus
      });
    } catch (error: any) {
      res.status(error.message.includes('quyền') ? 403 : 404).json({
        success: false,
        message: error.message || 'Không tìm thấy loại xe'
      });
    }
  }

  /**
   * @swagger
   * /api/company/type-buses:
   *   post:
   *     summary: Create new type bus (Company)
   *     tags: [Company - TypeBuses]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - totalSeats
   *               - numberRows
   *               - numberCols
   *               - isFloors
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Giường nằm 40 chỗ"
   *               totalSeats:
   *                 type: integer
   *                 example: 40
   *               numberRows:
   *                 type: integer
   *                 example: 10
   *               numberCols:
   *                 type: integer
   *                 example: 4
   *               isFloors:
   *                 type: boolean
   *                 example: false
   *               numberRowsFloor:
   *                 type: integer
   *                 example: 0
   *               numberColsFloor:
   *                 type: integer
   *                 example: 0
   *     responses:
   *       201:
   *         description: Created successfully
   *       400:
   *         description: Invalid input
   *       403:
   *         description: Permission denied
   */
  async companyCreateTypeBus(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const busCompanyId = user?.companyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const typeBus = await TypeBusService.createTypeBus({
        ...req.body,
        busCompanyId
      });

      res.status(201).json({
        success: true,
        message: 'Tạo loại xe thành công',
        data: typeBus
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo loại xe'
      });
    }
  }

  /**
   * @swagger
   * /api/company/type-buses/{id}:
   *   put:
   *     summary: Update company's type bus
   *     tags: [Company - TypeBuses]
   *     security:
   *       - bearerAuth: []
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
   *               totalSeats:
   *                 type: integer
   *               numberRows:
   *                 type: integer
   *               numberCols:
   *                 type: integer
   *               isFloors:
   *                 type: boolean
   *               numberRowsFloor:
   *                 type: integer
   *               numberColsFloor:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Updated successfully
   *       400:
   *         description: Invalid input
   *       403:
   *         description: Permission denied
   *       404:
   *         description: Not found
   */
  async companyUpdateTypeBus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const busCompanyId = user?.companyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const typeBus = await TypeBusService.updateTypeBus(id, req.body, busCompanyId);

      res.json({
        success: true,
        message: 'Cập nhật loại xe thành công',
        data: typeBus
      });
    } catch (error: any) {
      const status = error.message.includes('quyền') ? 403 : 400;
      res.status(status).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật loại xe'
      });
    }
  }

  /**
   * @swagger
   * /api/company/type-buses/{id}:
   *   delete:
   *     summary: Delete company's type bus
   *     tags: [Company - TypeBuses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Deleted successfully
   *       400:
   *         description: Cannot delete (in use)
   *       403:
   *         description: Permission denied
   *       404:
   *         description: Not found
   */
  async companyDeleteTypeBus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const busCompanyId = user?.companyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const result = await TypeBusService.deleteTypeBus(id, busCompanyId);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      const status = error.message.includes('quyền') ? 403 : 400;
      res.status(status).json({
        success: false,
        message: error.message || 'Lỗi khi xóa loại xe'
      });
    }
  }
}

export default new TypeBusController();
