import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ITemplate {
    id: string
    companyId: string
    busRoutesId: string
    busId: string
    name: string
    is_active: boolean
    createdAt: Date
}

export default class Template extends BaseModel implements ITemplate {
    id!: string
    companyId!: string
    busRoutesId!: string
    busId!: string
    name!: string
    is_active!: boolean
    createdAt!: Date

    static tableName = 'templates'

    static relationMappings: RelationMappings = {
        busRoute: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./BusRoute').default,
            join: { from: 'templates.bus_routes_id', to: 'bus_routes.id' }
        },
        bus: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Bus').default,
            join: { from: 'templates.bus_id', to: 'buses.id' }
        },
        company: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./BusCompany').default,
            join: { from: 'templates.company_id', to: 'bus_companies.id' }
        },
        trip: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Trip').default,
            join: { from: 'templates.id', to: 'trips.template_id' }
        }
    }
}