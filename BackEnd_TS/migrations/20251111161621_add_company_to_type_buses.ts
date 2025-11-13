import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('type_buses', (table) => {
    table.uuid('bus_company_id').nullable().references('id').inTable('bus_companies').onDelete('CASCADE');
    table.index('bus_company_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('type_buses', (table) => {
    table.dropColumn('bus_company_id');
  });
}
