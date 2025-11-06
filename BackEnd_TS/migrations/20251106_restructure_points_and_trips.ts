import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create trip_points table
  await knex.schema.createTable('trip_points', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('trip_id').notNullable();
    table.uuid('point_id').notNullable();
    table.timestamp('time').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // Foreign keys
    table.foreign('trip_id').references('id').inTable('trips').onDelete('CASCADE');
    table.foreign('point_id').references('id').inTable('points').onDelete('CASCADE');

    // Unique constraint
    table.unique(['trip_id', 'point_id', 'time']);
  });

  // Remove trip_id and time columns from points table
  await knex.schema.table('points', (table) => {
    table.dropForeign(['trip_id']);
    table.dropColumn('trip_id');
    table.dropColumn('time');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Add back trip_id and time columns to points table
  await knex.schema.table('points', (table) => {
    table.uuid('trip_id');
    table.timestamp('time');
    table.foreign('trip_id').references('id').inTable('trips').onDelete('CASCADE');
  });

  // Drop trip_points table
  await knex.schema.dropTableIfExists('trip_points');
}
