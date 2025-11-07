import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('partners', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('full_name').notNullable();
    table.string('company').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable().unique();
    table.text('message');
    table.enum('status', ['processed', 'unprocessed']).defaultTo('unprocessed');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Create index for faster queries
  await knex.schema.raw(`
    CREATE INDEX idx_partners_status ON partners(status);
    CREATE INDEX idx_partners_email ON partners(email);
    CREATE INDEX idx_partners_phone ON partners(phone);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('partners');
}
