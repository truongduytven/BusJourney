import { Request, Response } from 'express'
import AuthService, {
  SignInRequest,
  SignUpRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  GoogleSignInRequest,
  UpdatePhoneRequest
} from '../services/AuthService'

class AuthController {
  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     summary: Đăng nhập
   *     tags: [Auth]
   *     requestBody:
   *       description: Thông tin đăng nhập
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Đăng nhập thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       401:
   *         description: Email hoặc mật khẩu không đúng
   *       500:
   *         description: Lỗi server
   */
  async signIn(req: Request<{}, {}, SignInRequest>, res: Response) {
    try {
      const { email, password } = req.body

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email và mật khẩu là bắt buộc'
        })
      }

      const result = await AuthService.signIn({ email, password })

      if (!result.success) {
        const statusCode = result.code === 'INVALID_CREDENTIALS' ? 401 : 
                          result.code === 'NOT_VERIFIED' ? 401 : 400
        return res.status(statusCode).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('SignIn error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Đăng ký tài khoản mới
   *     tags: [Auth]
   *     requestBody:
   *       description: Thông tin đăng ký
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - name
   *               - phone
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               name:
   *                 type: string
   *               phone:
   *                 type: string
   *               address:
   *                 type: string
   *               role:
   *                 type: string
   *     responses:
   *       201:
   *         description: Đăng ký thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       409:
   *         description: Email đã được sử dụng
   *       500:
   *         description: Lỗi server
   */
  async signUp(req: Request, res: Response) {
    try {
      const { name, email, phone, password, role } = req.body

      // Validation
      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          success: false,
          message: 'Tên người dùng, email, số điện thoại và mật khẩu là bắt buộc'
        })
      }

      const result = await AuthService.signUp({ name, email, phone, password, role })

      if (!result.success) {
        const statusCode = result.code === 'EMAIL_EXISTS' ? 409 : 400
        return res.status(statusCode).json(result)
      }

      return res.status(201).json(result)
    } catch (error) {
      console.error('SignUp error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * @swagger
   * /auth/verify-otp:
   *   post:
   *     summary: Xác thực OTP
   *     tags: [Auth]
   *     requestBody:
   *       description: Thông tin xác thực OTP
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - otp
   *             properties:
   *               email:
   *                 type: string
   *               otp:
   *                 type: string
   *     responses:
   *       200:
   *         description: Xác thực thành công
   *       400:
   *         description: OTP không đúng hoặc tài khoản đã được xác thực
   *       404:
   *         description: Không tìm thấy tài khoản
   *       500:
   *         description: Lỗi server
   */
  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body
      
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email và mã OTP là bắt buộc'
        })
      }

      const result = await AuthService.verifyOtp({ email, otp })

      if (!result.success) {
        const statusCode = result.code === 'ACCOUNT_NOT_FOUND' ? 404 : 400
        return res.status(statusCode).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('VerifyOtp error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * @swagger
   * /auth/change-password:
   *   put:
   *     summary: Đổi mật khẩu
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       description: Thông tin để đổi mật khẩu
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - accountId
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               accountId:
   *                 type: string
   *               currentPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Đổi mật khẩu thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       401:
   *         description: Mật khẩu hiện tại không đúng
   *       404:
   *         description: Không tìm thấy tài khoản
   *       500:
   *         description: Lỗi server
   */
  async changePassword(req: Request<{}, {}, ChangePasswordRequest>, res: Response) {
    try {
      const { accountId, currentPassword, newPassword } = req.body

      // Validation
      if (!accountId || !currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'AccountId, mật khẩu hiện tại và mật khẩu mới là bắt buộc'
        })
      }

      const result = await AuthService.changePassword({ accountId, currentPassword, newPassword })

      if (!result.success) {
        const statusCode = result.code === 'ACCOUNT_NOT_FOUND' ? 404 :
                          result.code === 'INVALID_PASSWORD' ? 401 : 400
        return res.status(statusCode).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('ChangePassword error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * @swagger
   * /auth/reset-password:
   *   put:
   *     summary: Reset mật khẩu
   *     tags: [Auth]
   *     requestBody:
   *       description: Thông tin để reset mật khẩu
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - accountId
   *               - newPassword
   *             properties:
   *               accountId:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Reset mật khẩu thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       404:
   *         description: Không tìm thấy tài khoản
   *       500:
   *         description: Lỗi server
   */
  async resetPasswordByAccountId(req: Request<{}, {}, ResetPasswordRequest>, res: Response) {
    try {
      const { accountId, newPassword } = req.body
      
      if (!accountId || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'AccountId và mật khẩu mới là bắt buộc'
        })
      }

      const result = await AuthService.resetPassword({ accountId, newPassword })

      if (!result.success) {
        const statusCode = result.code === 'ACCOUNT_NOT_FOUND' ? 404 : 400
        return res.status(statusCode).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('ResetPassword error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Lấy thông tin tài khoản
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Thông tin tài khoản
   *       401:
   *         description: Chưa xác thực
   *       404:
   *         description: Không tìm thấy tài khoản
   *       500:
   *         description: Lỗi server
   */
  async getProfile(req: Request, res: Response) {
    try {
      const accountId = (req as any).user?.accountId

      if (!accountId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }

      const result = await AuthService.getProfile(accountId)

      if (!result.success) {
        return res.status(404).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('GetProfile error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * @swagger
   * /auth/resend-otp:
   *   post:
   *     summary: Gửi lại mã OTP
   *     tags: [Auth]
   *     requestBody:
   *       description: Email để gửi lại OTP
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Gửi lại OTP thành công
   *       400:
   *         description: Email không hợp lệ hoặc tài khoản đã được xác thực
   *       404:
   *         description: Không tìm thấy tài khoản
   *       500:
   *         description: Lỗi server
   */
  async resendOTP(req: Request, res: Response) {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email là bắt buộc'
        })
      }

      const result = await AuthService.resendOTP(email)

      if (!result.success) {
        const statusCode = result.code === 'ACCOUNT_NOT_FOUND' ? 404 : 400
        return res.status(statusCode).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('ResendOTP error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * @swagger
   * /auth/google-signin:
   *   post:
   *     summary: Đăng nhập bằng Google OAuth
   *     tags: [Auth]
   *     requestBody:
   *       description: Google credential token
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - credential
   *             properties:
   *               credential:
   *                 type: string
   *                 description: Google JWT credential token
   *     responses:
   *       200:
   *         description: Đăng nhập Google thành công
   *       400:
   *         description: Thiếu credential hoặc không thể lấy email từ Google
   *       401:
   *         description: Token Google không hợp lệ
   *       409:
   *         description: Email đã được đăng ký bằng phương thức khác
   *       500:
   *         description: Lỗi server
   */
  async googleSignIn(req: Request<{}, {}, GoogleSignInRequest>, res: Response) {
    try {
      const { credential } = req.body

      if (!credential) {
        return res.status(400).json({
          success: false,
          message: 'Google credential là bắt buộc'
        })
      }

      const result = await AuthService.googleSignIn({ credential })

      if (!result.success) {
        const statusCode = result.code === 'INVALID_TOKEN' ? 401 :
                          result.code === 'EMAIL_EXISTS' ? 409 : 400
        return res.status(statusCode).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('Google sign in error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng nhập Google'
      })
    }
  }

  /**
   * @swagger
   * /auth/update-phone:
   *   put:
   *     summary: Cập nhật số điện thoại
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phone
   *             properties:
   *               phone:
   *                 type: string
   *                 pattern: '^0[0-9]{9}$'
   *                 example: '0123456789'
   *     responses:
   *       200:
   *         description: Cập nhật số điện thoại thành công
   *       400:
   *         description: Số điện thoại không hợp lệ
   *       401:
   *         description: Token không hợp lệ
   *       409:
   *         description: Số điện thoại đã được sử dụng
   *       500:
   *         description: Lỗi server
   */
  async updatePhone(req: Request, res: Response) {
    try {
      const { phone } = req.body
      const authHeader = req.headers.authorization

      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Token không hợp lệ'
        })
      }

      const token = authHeader.substring(7)

      const result = await AuthService.updatePhone({ token, phone })

      if (!result.success) {
        const statusCode = result.code === 'INVALID_TOKEN' ? 401 :
                          result.code === 'PHONE_EXISTS' ? 409 : 400
        return res.status(statusCode).json(result)
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('Update phone error:', error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật số điện thoại'
      })
    }
  }
}

export default new AuthController();

// Export individual methods for backward compatibility
export const { 
  signIn, 
  signUp, 
  verifyOtp, 
  resendOTP, 
  googleSignIn, 
  changePassword, 
  resetPasswordByAccountId, 
  getProfile, 
  updatePhone 
} = new AuthController();
