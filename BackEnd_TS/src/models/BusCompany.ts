import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface IBusCompany {
    id: string
    name: string
    phone: string
    address: string
    createdAt: Date
    status: boolean
}

export default class BusCompany extends BaseModel implements IBusCompany {
    id!: string
    name!: string
    phone!: string
    address!: string
    createdAt!: Date
    status!: boolean

    static tableName = 'bus_companies'

    static relationMappings: RelationMappings = {
        templates: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Template').default,
            join: { from: 'bus_companies.id', to: 'templates.company_id' }
        },
        buses: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Bus').default,
            join: { from: 'bus_companies.id', to: 'buses.company_id' }
        },
        coupons: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Coupon').default,
            join: { from: 'bus_companies.id', to: 'coupons.company_id' }
        }
    }
}