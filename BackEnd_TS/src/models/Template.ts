import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ITemplate {
    id: string
    companyId: string
    routeId: string
    typeBusId: string
    name: string
    is_active: boolean
    createdAt: Date
}

export default class Template extends BaseModel implements ITemplate {
    id!: string
    companyId!: string
    routeId!: string
    typeBusId!: string
    name!: string
    is_active!: boolean
    createdAt!: Date

    static tableName = 'templates'

    static relationMappings: RelationMappings = {
        route: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Route').default,
            join: { from: 'templates.route_id', to: 'routes.id' }
        },
        typeBus: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./TypeBus').default,
            join: { from: 'templates.type_bus_id', to: 'type_buses.id' }
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