import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IRole {
  id: string
  name: string
}

export default class Role extends BaseModel implements IRole {
  id!: string
  name!: string

  static tableName = 'roles'

  static relationMappings: RelationMappings = {
    accounts: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Accounts').default,
      join: {
        from: 'roles.id',
        to: 'accounts.role_id'
      }
    }
  }
}
