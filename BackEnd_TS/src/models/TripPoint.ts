import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ITripPoint {
    id: string
    tripId: string
    pointId: string
    time: Date
    isActive: boolean
}

export default class TripPoint extends BaseModel implements ITripPoint {
    id!: string
    tripId!: string
    pointId!: string
    time!: Date
    isActive!: boolean

    static tableName = 'trip_points'

    static relationMappings: RelationMappings = {
        trip: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Trip').default,
            join: { from: 'trip_points.trip_id', to: 'trips.id' }
        },
        point: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Point').default,
            join: { from: 'trip_points.point_id', to: 'points.id' }
        }
    }
}
