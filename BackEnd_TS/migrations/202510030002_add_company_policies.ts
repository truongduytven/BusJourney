import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    // Company Policies table
    await knex.schema.createTable('company_policies', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
        t.uuid('company_id').references('bus_companies.id').onDelete('CASCADE').notNullable()
        t.string('policy_type', 30).notNullable() // 'CANCELLATION', 'GENERAL', 'BAGGAGE', 'CHILD_PREGNANT'
        t.string('title', 100).notNullable()
        t.text('content').notNullable()
        t.boolean('is_active').defaultTo(true)
        t.timestamp('created_at').defaultTo(knex.fn.now())
        t.timestamp('updated_at').defaultTo(knex.fn.now())
        
        // Index for faster queries
        t.index(['company_id', 'policy_type'])
        t.index(['company_id', 'is_active'])
    })

    // Cancellation Rules table - for structured cancellation policy data
    await knex.schema.createTable('cancellation_rules', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
        t.uuid('company_id').references('bus_companies.id').onDelete('CASCADE').notNullable()
        t.integer('time_before_departure').notNullable() // hours before departure
        t.decimal('refund_percentage', 5, 2).notNullable() // 0-100 percentage
        t.decimal('fee_amount', 12, 2).nullable() // fixed fee amount
        t.boolean('is_active').defaultTo(true)
        t.timestamp('created_at').defaultTo(knex.fn.now())
        t.timestamp('updated_at').defaultTo(knex.fn.now())
        
        // Index for faster queries
        t.index(['company_id', 'is_active'])
        t.index(['company_id', 'time_before_departure'])
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('cancellation_rules')
    await knex.schema.dropTableIfExists('company_policies')
}