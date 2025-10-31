import { Router } from 'express'
import { signIn, resetPasswordByAccountId, getProfile, changePassword, signUp, verifyOtp, resendOTP, googleSignIn, updatePhone } from '../controllers/auth'
import { authenticateToken, requireOwnerOrAdmin } from '../middlewares/authMiddleware'
const router = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization endpoints
 */

router.post('/signup', signUp)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOTP)
router.post('/signin', signIn)
router.post('/google-signin', googleSignIn)
router.put('/change-password', authenticateToken, requireOwnerOrAdmin, changePassword)
router.put('/reset-password', resetPasswordByAccountId)
router.get('/me', authenticateToken, getProfile)
router.put('/update-phone', authenticateToken, updatePhone)

export default router
