import { Request, Response } from 'express'
import UserService from '../services/UserService'

class UserController {
  /**
   * @openapi
   * /users:
   *   get:
   *     summary: Get user list with optional filters and pagination
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: roleName
   *         schema:
   *           type: string
   *         required: false
   *         description: Optional role name to filter users (e.g., "admin", "customer", "driver")
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *         required: false
   *         description: Account type filter (e.g., "local", "google")
   *       - in: query
   *         name: isVerified
   *         schema:
   *           type: boolean
   *         required: false
   *         description: Filter by verification status
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *         required: false
   *         description: Filter by active status
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         required: false
   *         description: Search by email or name
   *       - in: query
   *         name: pageNumber
   *         schema:
   *           type: integer
   *           default: 1
   *         required: true
   *         description: Page number (starts from 1)
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 10
   *         required: true
   *         description: Number of users per page
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
      const { roleName, type, isVerified, isActive, search, pageNumber, pageSize } = req.query

      if (!pageNumber || !pageSize) {
        return res.status(400).json({
          message: 'pageNumber and pageSize are required'
        })
      }

      // Convert boolean strings to boolean
      const isVerifiedBool = isVerified === 'true' ? true : isVerified === 'false' ? false : undefined;
      const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined;

      const userResult = await UserService.getListUsers({
        roleName: roleName as string | undefined,
        type: type as string | undefined,
        isVerified: isVerifiedBool,
        isActive: isActiveBool,
        search: search as string | undefined,
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
