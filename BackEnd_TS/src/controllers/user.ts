import { Request, Response } from 'express'
import UserService from '../services/UserService'

class UserController {
  /**
   * @openapi
   * /users/{roleName}:
   *   get:
   *     summary: Get user list by role with pagination
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: roleName
   *         schema:
   *           type: string
   *         required: true
   *       - in: query
   *         name: pageNumber
   *         schema:
   *           type: integer
   *           default: 1
   *         required: true
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 10
   *         required: true
   *     responses:
   *       200:
   *         description: User list retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Lấy danh sách người dùng thành công
   *                 data:
   *                   type: object
   *                   properties:
   *                     users:
   *                       type: array
   *                       items:
   *                         type: object
   *                     totalPage:
   *                       type: integer
   *                       example: 5
   *                     currentPage:
   *                       type: integer
   *                       example: 1
   *                     pageSize:
   *                       type: integer
   *                       example: 10
   *                     totalUsers:
   *                       type: integer
   *                       example: 45
   *       400:
   *         description: Invalid parameters
   *       404:
   *         description: Role not found
   *       500:
   *         description: Server error
   */
  async getListUsers(req: Request, res: Response) {
    try {
      const { roleName } = req.params
      const { pageNumber, pageSize } = req.query

      if (!roleName) {
        return res.status(400).json({
          message: 'Role name is required'
        })
      }

      if (!pageNumber || !pageSize) {
        return res.status(400).json({
          message: 'pageNumber and pageSize are required'
        })
      }

      const userResult = await UserService.getListUsers({
        roleName,
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize)
      })

      res.json({
        message: 'Lấy danh sách người dùng thành công',
        data: userResult
      })
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({
          message: err.message
        })
      }
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      })
    }
  }
}

export default new UserController()
