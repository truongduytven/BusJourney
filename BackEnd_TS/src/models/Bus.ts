import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface IBus {
    id: string
    companyId: string
    licensePlate: string
    typeBusId: string
    images: string[]
    extension: string[]
    isActive: boolean
}

export default class Bus extends BaseModel implements IBus {
    id!: string
    companyId!: string
    licensePlate!: string
    typeBusId!: string
    images!: string[]
    extension!: string[]
    isActive!: boolean

    static tableName = 'buses'

    static relationMappings: RelationMappings = {
        bus_companies: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./BusCompany').default,
            join: { from: 'buses.company_id', to: 'bus_companies.id' }
        },
        type_buses: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./TypeBus').default,
            join: { from: 'buses.type_bus_id', to: 'type_buses.id' }
        },
        trips: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Trip').default,
            join: { from: 'buses.id', to: 'trips.bus_id' }
        }
    }
}