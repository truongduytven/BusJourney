import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface IRoute {
    id: string
    startLocationId: string
    endLocationId: string
    distanceKm: number
    status?: string
    createdBy?: string
}

export default class Route extends BaseModel implements IRoute {
    id!: string
    startLocationId!: string
    endLocationId!: string
    distanceKm!: number
    status?: string
    createdBy?: string

    static tableName = 'routes'

    static relationMappings: RelationMappings = {
        startLocation: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Location').default,
            join: {
                from: 'routes.start_location_id',
                to: 'locations.id',
            }
        },
        endLocation: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Location').default,
            join: {
                from: 'routes.end_location_id',
                to: 'locations.id'
            }
        },
        busRoutes: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./BusRoute').default,
            join: { from: 'routes.id', to: 'bus_routes.route_id' }
        },
        // Note: trips now use bus_routes_id, not route_id directly
        // So this relation may not be used
    }
}
