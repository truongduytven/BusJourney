import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ITicket {
    id: string
    ticketCode: string
    orderId: string
    userId: number
    tripId: string
    seatCode: string
    qrCode: string | null
    status: string
    purchasedDate: Date
    checkedDate: Date | null
    checkedBy: string | null
    pickUpPointId: string | null
    dropOffPointId: string | null
} 

export default class Ticket extends BaseModel implements ITicket {
    id!: string
    ticketCode!: string
    orderId!: string
    userId!: number
    tripId!: string
    seatCode!: string
    qrCode!: string | null
    status!: string
    purchasedDate!: Date
    checkedDate!: Date | null
    checkedBy!: string | null
    pickUpPointId!: string | null
    dropOffPointId!: string | null

    static tableName = 'tickets'

    static relationMappings: RelationMappings = {
        account: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Accounts').default,
            join: { from: 'tickets.user_id', to: 'accounts.id' }
        },
        checker: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Accounts').default,
            join: { from: 'tickets.checked_by', to: 'accounts.id' }
        },
        order: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Order').default,
            join: { from: 'tickets.order_id', to: 'orders.id' }
        },
        trip: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Trip').default,
            join: { from: 'tickets.trip_id', to: 'trips.id' }
        },
        pickUpPoint: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Point').default,
            join: { from: 'tickets.pickup_point_id', to: 'points.id' }
        },
        dropOffPoint: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Point').default,
            join: { from: 'tickets.dropoff_point_id', to: 'points.id' }
        }
    }
}

