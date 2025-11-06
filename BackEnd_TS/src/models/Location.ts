import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ILocation {
    id: string
    cityId: string
    name: string
    isActive: boolean
}

export default class Location extends BaseModel implements ILocation {
    id!: string
    cityId!: string
    name!: string
    isActive!: boolean

    static tableName = 'locations'

    static relationMappings: RelationMappings = {
        city: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./City').default,
            join: {
                from: 'locations.city_id',
                to: 'cities.id'
            }
        },
        fromRoutes: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Route').default,
            join: {
                from: 'locations.id',
                to: 'routes.start_location_id'
            }
        },
        toRoutes: {
            relation: Model.HasManyRelation,
            modelClass: () => require('./Route').default,
            join: {
                from: 'locations.id',
                to: 'routes.end_location_id'
            }
        }
    }
}