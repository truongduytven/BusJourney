import { Request, Response } from 'express'
import PartnerService from '../services/PartnerService'

class PartnerController {
  /**
   * @openapi
   * /partners/register:
   *   post:
   *     summary: Register as a partner (Public endpoint)
   *     tags: [Partners]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fullName
   *               - company
   *               - email
   *               - phone
   *             properties:
   *               fullName:
   *                 type: string
   *               company:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *               message:
   *                 type: string
   *     responses:
   *       201:
   *         description: Partner registration successful
   *       400:
   *         description: Email or phone already registered
   *       500:
   *         description: Server error
   */
  async registerPartner(req: Request, res: Response) {
    try {
      const { fullName, company, email, phone, message } = req.body

      // Validate required fields
      if (!fullName || !company || !email || !phone) {
        return res.status(400).json({
          error: 'Vui lòng điền đầy đủ thông tin bắt buộc',
          message: 'Thiếu thông tin',
          success: false
        })
      }

      const partner = await PartnerService.registerPartner({
        fullName,
        company,
        email,
        phone,
        message
      })

      res.status(201).json({
        message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
        data: partner,
        success: true
      })
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
        message: 'Đăng ký thất bại',
        success: false
      })
    }
  }

  /**
   * @openapi
   * /partners:
   *   get:
   *     summary: Get list of partner registrations (Admin only)
   *     tags: [Partners]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [processed, unprocessed]
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: pageNumber
   *         schema:
   *           type: integer
   *           default: 1
   *     responses:
   *       200:
   *         description: List of partners
   *       500:
   *         description: Server error
   */
  async getListPartners(req: Request, res: Response) {
    try {
      const { status, search, pageSize, pageNumber } = req.query

      const result = await PartnerService.getListPartners({
        status: status as any,
        search: search as string,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        pageNumber: pageNumber ? parseInt(pageNumber as string) : undefined,
      })

      res.status(200).json({
        message: 'Lấy danh sách đăng ký đối tác thành công',
        data: result,
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
   * /partners/{id}:
   *   get:
   *     summary: Get partner by ID (Admin only)
   *     tags: [Partners]
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
   *         description: Partner details
   *       404:
   *         description: Partner not found
   *       500:
   *         description: Server error
   */
  async getPartnerById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const partner = await PartnerService.getPartnerById(id)

      res.status(200).json({
        message: 'Lấy thông tin đối tác thành công',
        data: partner,
        success: true
      })
    } catch (error: any) {
      res.status(404).json({
        error: error.message,
        message: 'Không tìm thấy',
        success: false
      })
    }
  }

  /**
   * @openapi
   * /partners/{id}/status:
   *   patch:
   *     summary: Update partner status (Admin only)
   *     tags: [Partners]
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
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [processed, unprocessed]
   *     responses:
   *       200:
   *         description: Status updated successfully
   *       404:
   *         description: Partner not found
   *       500:
   *         description: Server error
   */
  async updatePartnerStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body

      if (!status || !['processed', 'unprocessed'].includes(status)) {
        return res.status(400).json({
          error: 'Trạng thái không hợp lệ',
          message: 'Dữ liệu không hợp lệ',
          success: false
        })
      }

      const partner = await PartnerService.updatePartnerStatus(id, status)

      res.status(200).json({
        message: 'Cập nhật trạng thái thành công',
        data: partner,
        success: true
      })
    } catch (error: any) {
      res.status(404).json({
        error: error.message,
        message: 'Cập nhật thất bại',
        success: false
      })
    }
  }

  /**
   * @openapi
   * /partners/{id}:
   *   delete:
   *     summary: Delete partner registration (Admin only)
   *     tags: [Partners]
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
   *         description: Partner deleted successfully
   *       404:
   *         description: Partner not found
   *       500:
   *         description: Server error
   */
  async deletePartner(req: Request, res: Response) {
    try {
      const { id } = req.params

      await PartnerService.deletePartner(id)

      res.status(200).json({
        message: 'Xóa đăng ký đối tác thành công',
        success: true
      })
    } catch (error: any) {
      res.status(404).json({
        error: error.message,
        message: 'Xóa thất bại',
        success: false
      })
    }
  }

  /**
   * @openapi
   * /partners/stats:
   *   get:
   *     summary: Get partner statistics (Admin only)
   *     tags: [Partners]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Partner statistics
   *       500:
   *         description: Server error
   */
  async getPartnerStats(req: Request, res: Response) {
    try {
      const stats = await PartnerService.getPartnerStats()

      res.status(200).json({
        message: 'Lấy thống kê thành công',
        data: stats,
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

export default new PartnerController()
