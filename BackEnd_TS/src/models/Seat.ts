import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ISeat {
    id: string
    code: string
    indexCol: number
    indexRow: number
    floor: number
    typeBusId: string
}

export default class Seat extends BaseModel implements ISeat {
    id!: string
    code!: string
    indexCol!: number
    indexRow!: number
    floor!: number
    typeBusId!: string

    static tableName = 'seats'

    static relationMappings: RelationMappings = {
        typebus: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./TypeBus').default,
            join: { from: 'seats.type_bus_id', to: 'type_buses.id' }
        }
    }
}