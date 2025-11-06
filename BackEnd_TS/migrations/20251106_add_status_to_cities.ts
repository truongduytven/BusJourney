import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('cities', (table) => {
    table.boolean('is_active').defaultTo(true).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('cities', (table) => {
    table.dropColumn('is_active');
  });
}
