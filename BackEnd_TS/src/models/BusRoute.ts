import { Model, RelationMappings } from 'objection'
import BaseModel from './BaseModel'

export interface IBusRoute {
  id: string
  routeId: string
  busCompanyId: string
  status: boolean
}

export default class BusRoute extends BaseModel implements IBusRoute {
  id!: string
  routeId!: string
  busCompanyId!: string
  status!: boolean

  static tableName = 'bus_routes'

  static relationMappings: RelationMappings = {
    route: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Route').default,
      join: {
        from: 'bus_routes.route_id',
        to: 'routes.id',
      },
    },
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./BusCompany').default,
      join: {
        from: 'bus_routes.bus_company_id',
        to: 'bus_companies.id',
      },
    },
    templates: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Template').default,
      join: { from: 'bus_routes.id', to: 'templates.bus_routes_id' },
    },
    trips: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Trip').default,
      join: { from: 'bus_routes.id', to: 'trips.bus_routes_id' },
    },
  }
}
