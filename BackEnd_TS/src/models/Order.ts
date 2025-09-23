import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface IOrder {
    id: string
    couponId: string | null
    userId: string
    originAmount: number
    finalAmount: number
    status: string
    createdAt: string
}

export default class Order extends BaseModel implements IOrder {
    id!: string
    couponId!: string | null
    userId!: string
    originAmount!: number
    finalAmount!: number
    status!: string
    createdAt!: string

    static tableName = 'orders'

    static relationMappings: RelationMappings = {
        account: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Accounts').default,
            join: { from: 'orders.user_id', to: 'accounts.id' }
        },
        coupon: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Coupon').default,
            join: { from: 'orders.coupon_id', to: 'coupons.id' }
        },
        transaction: {
            relation: Model.HasOneRelation,
            modelClass: () => require('./Transaction').default,
            join: { from: 'orders.id', to: 'transactions.order_id' }
        },
        tickets: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Ticket').default,
            join: { from: 'orders.id', to: 'tickets.order_id' }
        }
    }
}