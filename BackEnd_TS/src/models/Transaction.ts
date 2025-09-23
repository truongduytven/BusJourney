import { Model, RelationMappings } from "objection"
import BaseModel from "./BaseModel"

export interface ITransaction {
    id: string
    orderId: string
    amount: number
    paymentMethod: string
    status: string
    createdAt: string
}

export default class Transaction extends BaseModel implements ITransaction {
    id!: string
    orderId!: string
    amount!: number
    paymentMethod!: string
    status!: string
    createdAt!: string

    static tableName = 'transactions'

    static relationMappings: RelationMappings = {
        order: {
            relation: Model.BelongsToOneRelation,
            modelClass: () => require('./Order').default,
            join: { from: 'transactions.order_id', to: 'orders.id' }
        }
    }
}