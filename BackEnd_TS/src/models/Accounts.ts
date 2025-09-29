import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IAccount {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  type: string
  address: string
  password: string
  roleId: string
  companyId?: string
  otpCode: string
  googleId?: string
  otpExpiredAt?: Date
  isVerified: boolean
  isActive: boolean
  createAt: Date
}

export default class Account extends BaseModel implements IAccount {
  id!: string
  name!: string
  email!: string
  phone!: string
  avatar!: string
  type!: string
  address!: string
  password!: string
  roleId!: string
  companyId?: string
  otpCode!: string
  googleId?: string
  otpExpiredAt?: Date
  isVerified!: boolean
  isActive!: boolean
  createAt!: Date

  static tableName = 'accounts'

  static relationMappings: RelationMappings = {
    roles: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Role').default,
      join: { from: 'accounts.role_id', to: 'roles.id' }
    },
    orders: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Order').default,
      join: { from: 'accounts.id', to: 'orders.user_id' }
    },
    reviews: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Review').default,
      join: { from: 'accounts.id', to: 'reviews.create_by' }
    },
    ticketBuy: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Ticket').default,
      join: { from: 'accounts.id', to: 'tickets.user_id' }
    },
    ticketCheck: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Ticket').default,
      join: { from: 'accounts.id', to: 'tickets.checked_by' }
    },
  }
}
