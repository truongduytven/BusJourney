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

      // Get current logged-in user ID
      const currentUserId = req.user?.accountId;

      // Convert boolean strings to boolean
      const isVerifiedBool = isVerified === 'true' ? true : isVerified === 'false' ? false : undefined;
      const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined;

      const userResult = await UserService.getListUsers({
        roleName: roleName as string | undefined,
        type: type as string | undefined,
        isVerified: isVerifiedBool,
        isActive: isActiveBool,
        search: search as string | undefined,
        excludeUserId: currentUserId, // Exclude current logged-in user
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

  /**
   * @openapi
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *               - roleId
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               phone:
   *                 type: string
   *               roleId:
   *                 type: string
   *               isVerified:
   *                 type: boolean
   *               isActive:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Invalid input or email already exists
   *       500:
   *         description: Server error
   */
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, phone, roleId, isVerified, isActive } = req.body;

      if (!name || !email || !password || !roleId) {
        return res.status(400).json({
          message: 'Tên, email, mật khẩu và vai trò là bắt buộc'
        });
      }

      const newUser = await UserService.createUser({
        name,
        email,
        password,
        phone,
        roleId,
        isVerified: isVerified ?? false,
        isActive: isActive ?? true
      });

      res.status(201).json({
        message: 'Tạo người dùng thành công',
        data: newUser
      });
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        return res.status(400).json({
          message: err.message
        });
      }
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      });
    }
  }

  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await UserService.getUserById(id);

      res.json({
        message: 'Lấy thông tin người dùng thành công',
        data: user
      });
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({
          message: err.message
        });
      }
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      });
    }
  }

  /**
   * @openapi
   * /users/{id}:
   *   put:
   *     summary: Update user
   *     tags: [Users]
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
   *               phone:
   *                 type: string
   *               roleId:
   *                 type: string
   *               isVerified:
   *                 type: boolean
   *               isActive:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: User updated successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, phone, roleId, isVerified, isActive } = req.body;

      const updatedUser = await UserService.updateUser(id, {
        name,
        phone,
        roleId,
        isVerified,
        isActive
      });

      res.json({
        message: 'Cập nhật người dùng thành công',
        data: updatedUser
      });
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({
          message: err.message
        });
      }
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      });
    }
  }

  /**
   * @openapi
   * /users/bulk-toggle-active:
   *   put:
   *     summary: Toggle active status for multiple users
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userIds
   *               - isActive
   *             properties:
   *               userIds:
   *                 type: array
   *                 items:
   *                   type: string
   *               isActive:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Users updated successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Server error
   */
  async bulkToggleActive(req: Request, res: Response) {
    try {
      const { userIds, isActive } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          message: 'userIds là bắt buộc và phải là một mảng không rỗng'
        });
      }

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          message: 'isActive là bắt buộc và phải là boolean'
        });
      }

      const result = await UserService.bulkToggleActive(userIds, isActive);

      res.json({
        message: `Đã ${isActive ? 'mở khóa' : 'khóa'} ${result} tài khoản thành công`,
        data: { updatedCount: result }
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
        message: 'Lỗi hệ thống'
      });
    }
  }
}

export default new UserController()
