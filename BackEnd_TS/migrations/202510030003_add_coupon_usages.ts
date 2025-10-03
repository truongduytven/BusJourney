import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    // Coupon Usages table - track which users have used which coupons
    await knex.schema.createTable('coupon_usages', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
        t.uuid('user_id').references('accounts.id').onDelete('CASCADE').notNullable()
        t.uuid('coupon_id').references('coupons.id').onDelete('CASCADE').notNullable()
        t.uuid('order_id').references('orders.id').onDelete('CASCADE').notNullable()
        t.timestamp('used_at').defaultTo(knex.fn.now())
        t.boolean('is_active').defaultTo(true)
        
        // Unique constraint to prevent duplicate usage records
        t.unique(['user_id', 'coupon_id', 'order_id'])
        
        // Indexes for faster queries
        t.index(['user_id', 'coupon_id'])
        t.index(['coupon_id', 'is_active'])
        t.index(['user_id', 'is_active'])
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('coupon_usages')
}