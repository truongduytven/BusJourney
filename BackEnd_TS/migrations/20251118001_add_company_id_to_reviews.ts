import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('reviews', (t) => {
    t.uuid('company_id').references('bus_companies.id').after('trip_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('reviews', (t) => {
    t.dropColumn('company_id')
  })
}
