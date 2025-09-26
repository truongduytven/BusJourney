import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ICoupon {
    id: string
    description: string
    discountType: string
    discountValue: number
    maxDiscountValue?: number
    maxUses: number
    usedCount: number
    validFrom: Date
    validTo: Date
    status: string
    companyId?: string
    createdBy: string
}

export default class Coupon extends BaseModel implements ICoupon {
    id!: string
    description!: string
    discountType!: string
    discountValue!: number
    maxDiscountValue?: number
    maxUses!: number
    usedCount!: number
    validFrom!: Date
    validTo!: Date
    status!: string
    companyId?: string
    createdBy!: string

    static tableName = 'coupons'

    static relationMappings: RelationMappings = {
        company: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./BusCompany').default,
            join: { from: 'coupons.company_id', to: 'bus_companies.id' }
        },
        order: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Order').default,
            join: { from: 'coupons.id', to: 'orders.coupon_id' }
        }
    }
}