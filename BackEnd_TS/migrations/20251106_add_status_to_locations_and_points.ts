import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Add is_active column to locations table
  await knex.schema.alterTable('locations', (table) => {
    table.boolean('is_active').defaultTo(true).notNullable();
  });

  // Add is_active column to points table
  await knex.schema.alterTable('points', (table) => {
    table.boolean('is_active').defaultTo(true).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove is_active column from locations table
  await knex.schema.alterTable('locations', (table) => {
    table.dropColumn('is_active');
  });

  // Remove is_active column from points table
  await knex.schema.alterTable('points', (table) => {
    table.dropColumn('is_active');
  });
}
