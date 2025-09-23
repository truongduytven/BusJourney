import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface IReview {
    id: string
    tripId: string
    rating: number
    commentText: string
    createdAt: string
    createdBy: string
    isVisible: boolean
}

export default class Review extends BaseModel implements IReview {
    id!: string
    tripId!: string
    rating!: number
    commentText!: string
    createdAt!: string
    createdBy!: string
    isVisible!: boolean

    static tableName = 'reviews'

    static relationMappings: RelationMappings = {
        trip: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Trip').default,
            join: { from: 'reviews.trip_id', to: 'trips.id' }
        },
        account: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Accounts').default,
            join: { from: 'reviews.created_by', to: 'accounts.id' }
        }
    }
}