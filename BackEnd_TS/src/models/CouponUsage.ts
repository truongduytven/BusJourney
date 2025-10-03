import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ICouponUsage {
    id: string
    userId: string
    couponId: string
    orderId: string
    usedAt: Date
    isActive: boolean
}

export default class CouponUsage extends BaseModel implements ICouponUsage {
    id!: string
    userId!: string
    couponId!: string
    orderId!: string
    usedAt!: Date
    isActive!: boolean

    static tableName = 'coupon_usages'

    static relationMappings: RelationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Accounts').default,
            join: { from: 'coupon_usages.user_id', to: 'accounts.id' }
        },
        coupon: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Coupon').default,
            join: { from: 'coupon_usages.coupon_id', to: 'coupons.id' }
        },
        order: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Order').default,
            join: { from: 'coupon_usages.order_id', to: 'orders.id' }
        }
    }
}