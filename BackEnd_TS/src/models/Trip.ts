import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ITrip {
    id: string
    routeId: string
    templateId: string
    busId: string
    departureTime: Date
    arrivalTime: Date
    price: number
    status: boolean
}

export default class Trip extends BaseModel implements ITrip {
    id!: string
    routeId!: string
    templateId!: string
    busId!: string
    departureTime!: Date
    arrivalTime!: Date
    price!: number
    status!: boolean

    static tableName = 'trips'

    static relationMappings: RelationMappings = {
        route: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require("./Route").default,
            join: { from: 'trips.route_id', to: 'routes.id' }
        },
        template: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require("./Template").default,
            join: { from: 'trips.template_id', to: 'templates.id' }
        },
        buses: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require("./Bus").default,
            join: { from: 'trips.bus_id', to: 'buses.id' }
        },
        review: {
            relation: Model.HasManyRelation,
            modelClass: () => require("./Reviews").default,
            join: { from: 'trips.id', to: 'reviews.trip_id' }
        },
        tripPoints: {
            relation: Model.HasManyRelation,
            modelClass: () => require("./TripPoint").default,
            join: { from: 'trips.id', to: 'trip_points.trip_id' }
        },
        ticket: {
            relation: Model.HasManyRelation,
            modelClass: () => require("./Ticket").default,
            join: { from: 'trips.id', to: 'tickets.trip_id' }
        }
    }
}