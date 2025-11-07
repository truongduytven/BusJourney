import { Router } from 'express'
import { signIn, resetPasswordByAccountId, changePassword, signUp, verifyOtp, resendOTP, googleSignIn, updatePhone } from '../controllers/auth'
import ProfileController from '../controllers/profile'
import { authenticateToken, requireOwnerOrAdmin } from '../middlewares/authMiddleware'
import upload from '../middlewares/upload'
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
router.get('/me', authenticateToken, ProfileController.getProfile)
router.put('/update-phone', authenticateToken, updatePhone)

// Profile management endpoints
router.patch('/profile', authenticateToken, ProfileController.updateProfile)
router.post('/profile/avatar', authenticateToken, upload.single('avatar'), ProfileController.uploadAvatar)
router.patch('/profile/password', authenticateToken, ProfileController.changePassword)

export default router
