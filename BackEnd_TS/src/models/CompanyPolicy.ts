import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ICompanyPolicy {
    id: string
    companyId: string
    policyType: string // 'CANCELLATION', 'GENERAL', 'BAGGAGE', 'CHILD_PREGNANT'
    title: string
    content: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface ICancellationRule {
    id: string
    companyId: string
    timeBeforeDeparture: number // hours before departure
    refundPercentage: number // percentage to refund (0-100)
    feeAmount?: number // fixed fee amount
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export default class CompanyPolicy extends BaseModel implements ICompanyPolicy {
    id!: string
    companyId!: string
    policyType!: string
    title!: string
    content!: string
    isActive!: boolean
    createdAt!: Date
    updatedAt!: Date

    static tableName = 'company_policies'

    static relationMappings: RelationMappings = {
        company: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./BusCompany').default,
            join: { from: 'company_policies.company_id', to: 'bus_companies.id' }
        }
    }
}

export class CancellationRule extends BaseModel implements ICancellationRule {
    id!: string
    companyId!: string
    timeBeforeDeparture!: number
    refundPercentage!: number
    feeAmount?: number
    isActive!: boolean
    createdAt!: Date
    updatedAt!: Date

    static tableName = 'cancellation_rules'

    static relationMappings: RelationMappings = {
        company: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./BusCompany').default,
            join: { from: 'cancellation_rules.company_id', to: 'bus_companies.id' }
        }
    }
}