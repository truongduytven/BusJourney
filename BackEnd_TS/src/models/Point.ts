import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface IPoint {
    id: string
    type: string
    locationName: string
    isActive: boolean
}

export default class Point extends BaseModel implements IPoint {
    id!: string
    type!: string
    locationName!: string
    isActive!: boolean

    static tableName = 'points'

    static relationMappings: RelationMappings = {
        tripPoints: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./TripPoint').default,
            join: { from: 'points.id', to: 'trip_points.point_id' }
        },
        pickUpTickets: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Ticket').default,
            join: { from: 'points.id', to: 'tickets.pick_up_point_id' }
        },
        dropOffTickets: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Ticket').default,
            join: { from: 'points.id', to: 'tickets.drop_off_point_id' }
        }
    }
}