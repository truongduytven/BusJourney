import { Request, Response } from 'express'
import Role from '../models/Role'

class RoleController {
  /**
   * @openapi
   * /roles:
   *   get:
   *     summary: Get all roles
   *     tags: [Roles]
   *     responses:
   *       200:
   *         description: Roles retrieved successfully
   *       500:
   *         description: Server error
   */
  async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await Role.query().select('id', 'name');

      res.json({
        message: 'Lấy danh sách vai trò thành công',
        data: roles
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      });
    }
  }
}

export default new RoleController()
