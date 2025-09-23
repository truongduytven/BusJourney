import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface IRoute {
    id: string
    startLocationId: string
    endLocationId: string
    distance: number
}

export default class Route extends BaseModel implements IRoute {
    id!: string
    startLocationId!: string
    endLocationId!: string
    distance!: number

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
        template: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Template').default,
            join: { from: 'routes.id', to: 'templates.route_id' }
        },
        trip: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Trip').default,
            join: { from: 'routes.id', to: 'trips.route_id' }
        }
    }
}
