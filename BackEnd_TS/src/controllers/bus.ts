import { Request, Response } from 'express';
import { BusService } from '../services/BusService';
import cloudinary from '../config/cloudinary';

export class BusController {
  /**
   * @swagger
   * /api/buses:
   *   get:
   *     summary: Get all buses (Admin view all)
   *     tags: [Buses]
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
   *         name: typeBusId
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Success
   */
  static async adminListBuses(req: Request, res: Response) {
    try {
      const { page = 1, pageSize = 10, search, typeBusId } = req.query;

      const result = await BusService.listBuses(
        Number(page),
        Number(pageSize),
        search as string,
        typeBusId as string
      );

      res.json({
        success: true,
        message: 'Lấy danh sách xe thành công',
        ...result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách xe'
      });
    }
  }

  /**
   * @swagger
   * /api/buses/{id}:
   *   get:
   *     summary: Get bus by ID (Admin)
   *     tags: [Buses]
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
  static async adminGetBus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bus = await BusService.getBusById(id);

      res.json({
        success: true,
        message: 'Lấy thông tin xe thành công',
        data: bus
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin xe'
      });
    }
  }

  /**
   * @swagger
   * /api/buses/company:
   *   get:
   *     summary: Get company's buses
   *     tags: [Buses]
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
   *         name: typeBusId
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyListBuses(req: Request, res: Response) {
    try {
      const { page = 1, pageSize = 10, search, typeBusId } = req.query;
      const busCompanyId = (req as any).user?.companyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const result = await BusService.listBuses(
        Number(page),
        Number(pageSize),
        search as string,
        typeBusId as string,
        busCompanyId
      );

      res.json({
        success: true,
        message: 'Lấy danh sách xe thành công',
        ...result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách xe'
      });
    }
  }

  /**
   * @swagger
   * /api/buses/company/{id}:
   *   get:
   *     summary: Get company's bus by ID
   *     tags: [Buses]
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
  static async companyGetBus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const busCompanyId = (req as any).user?.busCompanyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const bus = await BusService.getBusById(id, busCompanyId);

      res.json({
        success: true,
        message: 'Lấy thông tin xe thành công',
        data: bus
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin xe'
      });
    }
  }

  /**
   * @swagger
   * /api/buses/company:
   *   post:
   *     summary: Create new bus
   *     tags: [Buses]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - licensePlate
   *               - typeBusId
   *             properties:
   *               licensePlate:
   *                 type: string
   *               typeBusId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created
   */
  static async companyCreateBus(req: Request, res: Response) {
    try {
      const busCompanyId = (req as any).user?.companyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const files = req.files as Express.Multer.File[] | undefined;
      let imageUrls: string[] = [];

      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'buses',
                transformation: [
                  { width: 800, height: 600, crop: 'limit' },
                  { quality: 'auto' },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result!.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          });
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      const extensions = req.body.extensions 
        ? JSON.parse(req.body.extensions) 
        : [];

      const bus = await BusService.createBus({
        licensePlate: req.body.licensePlate,
        typeBusId: req.body.typeBusId,
        busCompanyId,
        extensions,
        images: imageUrls,
      });

      res.status(201).json({
        success: true,
        message: 'Tạo xe thành công',
        data: bus
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo xe'
      });
    }
  }

  /**
   * @swagger
   * /api/buses/company/{id}:
   *   put:
   *     summary: Update bus
   *     tags: [Buses]
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
   *               licensePlate:
   *                 type: string
   *               typeBusId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Success
   */
  static async companyUpdateBus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const busCompanyId = (req as any).user?.companyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const files = req.files as Express.Multer.File[] | undefined;
      let newImageUrls: string[] = [];

      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'buses',
                transformation: [
                  { width: 800, height: 600, crop: 'limit' },
                  { quality: 'auto' },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result!.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          });
        });

        newImageUrls = await Promise.all(uploadPromises);
      }

      const existingImages = req.body.existingImages 
        ? JSON.parse(req.body.existingImages) 
        : [];

      const extensions = req.body.extensions 
        ? JSON.parse(req.body.extensions) 
        : undefined;

      const updateData: any = {};
      if (req.body.licensePlate) updateData.licensePlate = req.body.licensePlate;
      if (req.body.typeBusId) updateData.typeBusId = req.body.typeBusId;
      if (extensions !== undefined) updateData.extensions = extensions;
      
      updateData.images = [...existingImages, ...newImageUrls];

      console.log(updateData)

      const bus = await BusService.updateBus(id, updateData, busCompanyId);

      res.json({
        success: true,
        message: 'Cập nhật xe thành công',
        data: bus
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật xe'
      });
    }
  }

  /**
   * @swagger
   * /api/buses/company/{id}:
   *   delete:
   *     summary: Delete bus
   *     tags: [Buses]
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
  static async companyDeleteBus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const busCompanyId = (req as any).user?.busCompanyId;

      if (!busCompanyId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin nhà xe'
        });
      }

      const result = await BusService.deleteBus(id, busCompanyId);

      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa xe'
      });
    }
  }
}
