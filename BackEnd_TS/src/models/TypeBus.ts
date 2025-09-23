import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ITypeBus {
    id: string
    name: string
    totalSeats: number
    numberRows: number
    numberCols: number
    isFloor: boolean
    numberRowsFloor?: number
    numberColsFloor?: number
}

export default class TypeBus extends BaseModel implements ITypeBus {
    id!: string
    name!: string
    totalSeats!: number
    numberRows!: number
    numberCols!: number
    isFloor!: boolean
    numberRowsFloor?: number
    numberColsFloor?: number

    static tableName = 'type_buses'

    static relationMappings: RelationMappings = {
        seat: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Seat').default,
            join: { from: 'type_buses.id', to: 'seats.type_bus_id' }
        },
        template: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Template').default,
            join: { from: 'type_buses.id', to: 'templates.type_bus_id' }
        },
        buses: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Bus').default,
            join: { from: 'type_buses.id', to: 'buses.type_bus_id' }
        }
    }
}
