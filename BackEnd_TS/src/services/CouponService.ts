import Coupon from '../models/Coupon'
import CouponUsage from '../models/CouponUsage'
import Order from '../models/Order'
import { transaction } from 'objection'

export interface CouponValidationResult {
    isValid: boolean
    message: string
    discountAmount?: number
    finalAmount?: number
}

export interface CouponApplicationData {
    couponId: string
    userId: string
    originalAmount: number
}

class CouponService {
    /**
     * Validate if a coupon can be used by a specific user
     */
    async validateCoupon(couponId: string, userId: string): Promise<CouponValidationResult> {
        try {
            // Check if coupon exists and is active
            const coupon = await Coupon.query()
                .findById(couponId)
                .where('status', 'active')
                .where('valid_from', '<=', new Date())
                .where('valid_to', '>=', new Date())
                .first()

            if (!coupon) {
                return {
                    isValid: false,
                    message: 'Mã giảm giá không tồn tại hoặc đã hết hạn'
                }
            }

            // Check if coupon has reached max usage limit
            if (coupon.usedCount >= coupon.maxUses) {
                return {
                    isValid: false,
                    message: 'Mã giảm giá đã hết lượt sử dụng'
                }
            }

            // Check if user has already used this coupon
            const existingUsage = await CouponUsage.query()
                .where('user_id', userId)
                .where('coupon_id', couponId)
                .where('is_active', true)
                .first()

            if (existingUsage) {
                return {
                    isValid: false,
                    message: 'Bạn đã sử dụng mã giảm giá này rồi'
                }
            }

            return {
                isValid: true,
                message: 'Mã giảm giá hợp lệ'
            }
        } catch (error) {
            console.error('Error validating coupon:', error)
            return {
                isValid: false,
                message: 'Lỗi khi kiểm tra mã giảm giá'
            }
        }
    }

    /**
     * Calculate discount amount based on coupon type
     */
    calculateDiscount(coupon: Coupon, originalAmount: number): number {
        let discountAmount = 0

        if (coupon.discountType === 'percent') {
            discountAmount = (originalAmount * coupon.discountValue) / 100
            
            // Apply max discount limit if exists
            if (coupon.maxDiscountValue && discountAmount > coupon.maxDiscountValue) {
                discountAmount = coupon.maxDiscountValue
            }
        } else if (coupon.discountType === 'fixed') {
            discountAmount = coupon.discountValue
            
            // Don't allow discount to exceed original amount
            if (discountAmount > originalAmount) {
                discountAmount = originalAmount
            }
        }

        return Math.round(discountAmount)
    }

    /**
     * Apply coupon and create usage record
     */
    async applyCoupon(data: CouponApplicationData): Promise<CouponValidationResult> {
        const { couponId, userId, originalAmount } = data

        // First validate the coupon
        const validation = await this.validateCoupon(couponId, userId)
        if (!validation.isValid) {
            return validation
        }

        try {
            return await transaction(Coupon.knex(), async (trx) => {
                // Get coupon details
                const coupon = await Coupon.query(trx).findById(couponId)
                if (!coupon) {
                    throw new Error('Coupon not found')
                }

                // Calculate discount
                const discountAmount = this.calculateDiscount(coupon, originalAmount)
                const finalAmount = originalAmount - discountAmount

                // Update coupon used count
                await Coupon.query(trx)
                    .findById(couponId)
                    .patch({
                        usedCount: coupon.usedCount + 1
                    })

                return {
                    isValid: true,
                    message: 'Áp dụng mã giảm giá thành công',
                    discountAmount,
                    finalAmount
                }
            })
        } catch (error) {
            console.error('Error applying coupon:', error)
            return {
                isValid: false,
                message: 'Lỗi khi áp dụng mã giảm giá'
            }
        }
    }

    /**
     * Record coupon usage after successful order creation
     */
    async recordCouponUsage(userId: string, couponId: string, orderId: string): Promise<void> {
        try {
            await CouponUsage.query().insert({
                userId,
                couponId,
                orderId,
                usedAt: new Date(),
                isActive: true
            })
        } catch (error) {
            console.error('Error recording coupon usage:', error)
            throw error
        }
    }

    /**
     * Get user's coupon usage history
     */
    async getUserCouponUsages(userId: string): Promise<CouponUsage[]> {
        try {
            return await CouponUsage.query()
                .where('user_id', userId)
                .where('is_active', true)
                .withGraphJoined('[coupon, order]')
                .orderBy('used_at', 'desc')
        } catch (error) {
            console.error('Error getting user coupon usages:', error)
            throw error
        }
    }

    /**
     * Get available coupons for a user (excluding already used ones)
     */
    async getAvailableCouponsForUser(userId: string, companyId?: string): Promise<Coupon[]> {
        try {
            let query = Coupon.query()
                .where('status', 'active')
                .where('valid_from', '<=', new Date())
                .where('valid_to', '>=', new Date())
                .whereRaw('used_count < max_uses')

            if (companyId) {
                query = query.where('company_id', companyId)
            }

            // Get coupons that the user hasn't used yet
            const usedCouponIds = await CouponUsage.query()
                .select('coupon_id')
                .where('user_id', userId)
                .where('is_active', true)

            if (usedCouponIds.length > 0) {
                query = query.whereNotIn('id', usedCouponIds.map(usage => usage.couponId))
            }

            return await query.orderBy('discount_value', 'desc')
        } catch (error) {
            console.error('Error getting available coupons:', error)
            throw error
        }
    }

    /**
     * Deactivate coupon usage (for order cancellation)
     */
    async deactivateCouponUsage(orderId: string): Promise<void> {
        try {
            await transaction(CouponUsage.knex(), async (trx) => {
                // Find the coupon usage record
                const usage = await CouponUsage.query(trx)
                    .where('order_id', orderId)
                    .where('is_active', true)
                    .first()

                if (usage) {
                    // Deactivate the usage record
                    await CouponUsage.query(trx)
                        .findById(usage.id)
                        .patch({ isActive: false })

                    // Decrease coupon used count
                    const coupon = await Coupon.query(trx).findById(usage.couponId)
                    if (coupon && coupon.usedCount > 0) {
                        await Coupon.query(trx)
                            .findById(usage.couponId)
                            .patch({
                                usedCount: coupon.usedCount - 1
                            })
                    }
                }
            })
        } catch (error) {
            console.error('Error deactivating coupon usage:', error)
            throw error
        }
    }
}

export default new CouponService()