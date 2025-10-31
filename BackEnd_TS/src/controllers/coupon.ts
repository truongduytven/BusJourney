import { Request, Response } from 'express'
import CouponService from '../services/CouponService'
import Coupon from '../models/Coupon'
import { sendSuccess, sendValidationError, sendNotFoundError, handleControllerError } from '../utils/responseHelper'
import { validateRequiredFields } from '../utils/validationHelper'

class CouponController {
    /**
     * @swagger
     * /coupons/validate:
     *   post:
     *     summary: Validate a coupon for a specific user
     *     tags: [Coupons]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - couponId
     *               - userId
     *             properties:
     *               couponId:
     *                 type: string
     *                 description: ID of the coupon to validate
     *               userId:
     *                 type: string
     *                 description: ID of the user
     *     responses:
     *       200:
     *         description: Coupon validation result
     *       400:
     *         description: Invalid request
     *       500:
     *         description: Internal server error
     */
    async validateCoupon(req: Request, res: Response) {
        try {
            const { couponId, userId } = req.body

            const validation = validateRequiredFields({ couponId, userId }, ['couponId', 'userId']);
            if (!validation.isValid) {
                return sendValidationError(res, 'Thiếu thông tin couponId hoặc userId');
            }

            const result = await CouponService.validateCoupon(couponId, userId)

            res.json({
                success: result.isValid,
                message: result.message,
                data: result
            })
        } catch (error: any) {
            return handleControllerError(res, error, 'Error validating coupon');
        }
    }

    /**
     * @swagger
     * /coupons/apply:
     *   post:
     *     summary: Apply a coupon to calculate discount
     *     tags: [Coupons]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - couponId
     *               - userId
     *               - originalAmount
     *             properties:
     *               couponId:
     *                 type: string
     *                 description: ID of the coupon to apply
     *               userId:
     *                 type: string
     *                 description: ID of the user
     *               originalAmount:
     *                 type: number
     *                 description: Original order amount
     *     responses:
     *       200:
     *         description: Coupon application result with discount calculation
     *       400:
     *         description: Invalid request
     *       500:
     *         description: Internal server error
     */
    async applyCoupon(req: Request, res: Response) {
        try {
            const { couponId, userId, originalAmount } = req.body

            const validation = validateRequiredFields(
                { couponId, userId, originalAmount },
                ['couponId', 'userId', 'originalAmount']
            );
            if (!validation.isValid) {
                return sendValidationError(res, 'Thiếu thông tin bắt buộc (couponId, userId, originalAmount)');
            }

            const result = await CouponService.applyCoupon({
                couponId,
                userId,
                originalAmount
            })

            res.json({
                success: result.isValid,
                message: result.message,
                data: {
                    originalAmount,
                    discountAmount: result.discountAmount || 0,
                    finalAmount: result.finalAmount || originalAmount
                }
            })
        } catch (error: any) {
            return handleControllerError(res, error, 'Error applying coupon');
        }
    }

    /**
     * @swagger
     * /coupons/available/{userId}:
     *   get:
     *     summary: Get available coupons for a user
     *     tags: [Coupons]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *       - in: query
     *         name: companyId
     *         schema:
     *           type: string
     *         description: Filter by company ID
     *     responses:
     *       200:
     *         description: List of available coupons
     *       400:
     *         description: Invalid request
     *       500:
     *         description: Internal server error
     */
    async getAvailableCoupons(req: Request, res: Response) {
        try {
            const { userId } = req.params
            const { companyId } = req.query

            if (!userId) {
                return sendValidationError(res, 'Thiếu userId');
            }

            const coupons = await CouponService.getAvailableCouponsForUser(
                userId,
                companyId as string
            )

            return sendSuccess(res, 'Lấy danh sách coupon khả dụng thành công', coupons);
        } catch (error: any) {
            return handleControllerError(res, error, 'Error getting available coupons');
        }
    }

    /**
     * @swagger
     * /coupons/usage-history/{userId}:
     *   get:
     *     summary: Get user's coupon usage history
     *     tags: [Coupons]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: User's coupon usage history
     *       400:
     *         description: Invalid request
     *       500:
     *         description: Internal server error
     */
    async getCouponUsageHistory(req: Request, res: Response) {
        try {
            const { userId } = req.params

            if (!userId) {
                return sendValidationError(res, 'Thiếu userId');
            }

            const usageHistory = await CouponService.getUserCouponUsages(userId)

            return sendSuccess(res, 'Lấy lịch sử sử dụng coupon thành công', usageHistory);
        } catch (error: any) {
            return handleControllerError(res, error, 'Error getting coupon usage history');
        }
    }

    /**
     * @swagger
     * /coupons/{couponCode}:
     *   get:
     *     summary: Get coupon details by code
     *     tags: [Coupons]
     *     parameters:
     *       - in: path
     *         name: couponCode
     *         required: true
     *         schema:
     *           type: string
     *         description: Coupon code or ID
     *     responses:
     *       200:
     *         description: Coupon details
     *       404:
     *         description: Coupon not found
     *       500:
     *         description: Internal server error
     */
    async getCouponByCode(req: Request, res: Response) {
        try {
            const { couponCode } = req.params

            const coupon = await Coupon.query()
                .where('id', couponCode)
                .orWhere('description', 'like', `%${couponCode}%`)
                .where('status', 'active')
                .where('valid_from', '<=', new Date())
                .where('valid_to', '>=', new Date())
                .first()

            if (!coupon) {
                return sendNotFoundError(res, 'Không tìm thấy coupon');
            }

            // Don't expose sensitive information
            const safeCouo = {
                id: coupon.id,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                maxDiscountValue: coupon.maxDiscountValue,
                validFrom: coupon.validFrom,
                validTo: coupon.validTo,
                maxUses: coupon.maxUses,
                usedCount: coupon.usedCount,
                remainingUses: coupon.maxUses - coupon.usedCount
            }

            return sendSuccess(res, 'Lấy thông tin coupon thành công', coupon);
        } catch (error: any) {
            return handleControllerError(res, error, 'Error getting coupon by code');
        }
    }
}

export default new CouponController()