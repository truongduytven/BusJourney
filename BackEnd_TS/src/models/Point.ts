import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface IPoint {
    id: string
    tripId: string
    type: string
    time: Date
    locationName: string
}

export default class Point extends BaseModel implements IPoint {
    id!: string
    tripId!: string
    type!: string
    time!: Date
    locationName!: string

    static tableName = 'points'

    static relationMappings: RelationMappings = {
        trip: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Trip').default,
            join: { from: 'points.trip_id', to: 'trips.id' }
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