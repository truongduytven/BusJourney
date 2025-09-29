import { Router } from 'express'
import { signIn, resetPasswordByAccountId, getProfile, changePassword, signUp, verifyOtp, resendOTP, googleSignIn } from '../controllers/auth'
import { authenticateToken, requireOwnerOrAdmin } from '../middlewares/authMiddleware'
const router = Router()

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Thông tin đăng ký
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 */
router.post('/signup', signUp)

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Xác thực OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Thông tin xác thực OTP
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 */
router.post('/verify-otp', verifyOtp)

/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     summary: Gửi lại mã OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Email để gửi lại OTP
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gửi lại OTP thành công
 */
router.post('/resend-otp', resendOTP)

/**
 * @openapi
 * /auth/signin:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Thông tin đăng nhập
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 */
router.post('/signin', signIn)

/**
 * @openapi
 * /auth/google-signin:
 *   post:
 *     summary: Đăng nhập bằng Google OAuth
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Google credential token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google JWT credential token
 *     responses:
 *       '200':
 *         description: Đăng nhập Google thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     expiresIn:
 *                       type: string
 *       '400':
 *         description: Thiếu credential hoặc không thể lấy email từ Google
 *       '401':
 *         description: Token Google không hợp lệ
 *       '409':
 *         description: Email đã được đăng ký bằng phương thức khác
 *       '500':
 *         description: Lỗi server
 */
router.post('/google-signin', googleSignIn)

/**
 * @openapi
 * /auth/change-password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Thông tin để đổi mật khẩu
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 */
router.put('/change-password', authenticateToken, requireOwnerOrAdmin, changePassword)

/**
 * @openapi
 * /auth/reset-password:
 *   put:
 *     summary: Reset mật khẩu
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Thông tin để reset mật khẩu
 *       required: true
 *       content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  accountId:
 *                    type: string
 *                  newPassword:
 *                    type: string
 *     responses:
 *       200:
 *         description: Reset mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 */
router.put('/reset-password', resetPasswordByAccountId)

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin tài khoản
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Thông tin tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 */
router.get('/me', authenticateToken, getProfile)

export default router
