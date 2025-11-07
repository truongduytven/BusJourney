import { Request, Response } from 'express';
import ProfileService from '../services/ProfileService';

class ProfileController {
  /**
   * @swagger
   * /auth/profile:
   *   get:
   *     summary: Get user profile
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Account not found
   */
  async getProfile(req: Request, res: Response) {
    try {
      const accountId = (req as any).user?.accountId;

      if (!accountId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await ProfileService.getProfile(accountId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /auth/profile:
   *   patch:
   *     summary: Update user profile
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
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
   *               address:
   *                 type: string
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const accountId = (req as any).user?.accountId;

      if (!accountId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const updateData = req.body;

      const result = await ProfileService.updateProfile(accountId, updateData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /auth/profile/avatar:
   *   post:
   *     summary: Upload user avatar
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               avatar:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  async uploadAvatar(req: Request, res: Response) {
    try {
      const accountId = (req as any).user?.accountId;

      if (!accountId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Không có file được upload',
        });
      }

      const result = await ProfileService.uploadAvatar(accountId, req.file);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Upload avatar error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /auth/profile/password:
   *   patch:
   *     summary: Change user password
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  async changePassword(req: Request, res: Response) {
    try {
      const accountId = (req as any).user?.accountId;

      if (!accountId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin mật khẩu',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
        });
      }

      const result = await ProfileService.changePassword(accountId, {
        currentPassword,
        newPassword,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new ProfileController();
