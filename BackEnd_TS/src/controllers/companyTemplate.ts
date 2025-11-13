import { Request, Response } from 'express';
import { CompanyTemplateService } from '../services/CompanyTemplateService';

export class CompanyTemplateController {
  /**
   * @swagger
   * /api/templates/company:
   *   get:
   *     summary: Get company's templates
   *     tags: [Company Templates]
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
   *         name: isActive
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyListTemplates(req: Request, res: Response) {
    try {
      const { page = 1, pageSize = 10, search, busId, busRouteId, isActive } = req.query;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const result = await CompanyTemplateService.listCompanyTemplates(
        Number(page),
        Number(pageSize),
        search as string,
        busId as string,
        busRouteId as string,
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        companyId
      );

      res.json({
        success: true,
        message: 'Lấy danh sách template thành công',
        ...result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách template'
      });
    }
  }

  /**
   * @swagger
   * /api/templates/company/{id}:
   *   get:
   *     summary: Get company's template by ID
   *     tags: [Company Templates]
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
  static async companyGetTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const template = await CompanyTemplateService.getTemplateById(id, companyId);

      res.json({
        success: true,
        message: 'Lấy thông tin template thành công',
        data: template
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin template'
      });
    }
  }

  /**
   * @swagger
   * /api/templates/company:
   *   post:
   *     summary: Create new template
   *     tags: [Company Templates]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - busRoutesId
   *               - busId
   *             properties:
   *               name:
   *                 type: string
   *               busRoutesId:
   *                 type: string
   *               busId:
   *                 type: string
   *               is_active:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Created
   */
  static async companyCreateTemplate(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const template = await CompanyTemplateService.createTemplate({
        ...req.body,
        companyId
      });

      res.status(201).json({
        success: true,
        message: 'Tạo template thành công',
        data: template
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo template'
      });
    }
  }

  /**
   * @swagger
   * /api/templates/company/{id}:
   *   put:
   *     summary: Update template
   *     tags: [Company Templates]
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
   *               busRoutesId:
   *                 type: string
   *               busId:
   *                 type: string
   *               is_active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyUpdateTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const template = await CompanyTemplateService.updateTemplate(id, req.body, companyId);

      res.json({
        success: true,
        message: 'Cập nhật template thành công',
        data: template
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật template'
      });
    }
  }

  /**
   * @swagger
   * /api/templates/company/{id}/toggle:
   *   put:
   *     summary: Toggle template status
   *     tags: [Company Templates]
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
   *               - isActive
   *             properties:
   *               isActive:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyToggleTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const result = await CompanyTemplateService.toggleTemplateActive(id, isActive, companyId);

      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật trạng thái template'
      });
    }
  }

  /**
   * @swagger
   * /api/templates/company/bulk-toggle:
   *   put:
   *     summary: Toggle multiple templates status
   *     tags: [Company Templates]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - ids
   *               - isActive
   *             properties:
   *               ids:
   *                 type: array
   *                 items:
   *                   type: string
   *               isActive:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyBulkToggleTemplate(req: Request, res: Response) {
    try {
      const { ids, isActive } = req.body;
      const companyId = (req as any).user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const result = await CompanyTemplateService.bulkToggleTemplateActive(ids, isActive, companyId);

      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật trạng thái template'
      });
    }
  }
}
