import { Model } from "objection"
import BaseModel from "./BaseModel"

export interface IPartner {
    id: string
    fullName: string
    company: string
    email: string
    phone: string
    message: string | null
    status: 'processed' | 'unprocessed'
    createdAt: string
    updatedAt: string
}

export default class Partner extends BaseModel implements IPartner {
    id!: string
    fullName!: string
    company!: string
    email!: string
    phone!: string
    message!: string | null
    status!: 'processed' | 'unprocessed'
    createdAt!: string
    updatedAt!: string

    static tableName = 'partners'

    // No relations needed for now - partners is a standalone table
}
