import { Model, RelationMappings } from 'objection'
import BaseModel from './BaseModel'

export interface ICity {
  id: string
  name: string
}

export default class City extends BaseModel implements ICity {
  id!: string
  name!: string

  static tableName = 'cities'

  static relationMappings: RelationMappings = {
    locations: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Location').default,
      join: {
        from: 'cities.id',
        to: 'locations.city_id'
      }
    }
  }
}
