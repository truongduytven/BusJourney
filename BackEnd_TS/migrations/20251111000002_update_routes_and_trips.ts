import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Update routes table - Add status and created_by if not exist
  const hasStatusInRoutes = await knex.schema.hasColumn('routes', 'status');
  if (!hasStatusInRoutes) {
    await knex.schema.alterTable('routes', (table) => {
      table.string('status', 20).defaultTo('Pending');
    });
  }

  const hasCreatedByInRoutes = await knex.schema.hasColumn('routes', 'created_by');
  if (!hasCreatedByInRoutes) {
    await knex.schema.alterTable('routes', (table) => {
      table.uuid('created_by').references('id').inTable('accounts').onDelete('SET NULL');
    });
  }

  // 2. Update trips table
  // Drop route_id if exists
  const hasRouteIdInTrips = await knex.schema.hasColumn('trips', 'route_id');
  if (hasRouteIdInTrips) {
    await knex.schema.alterTable('trips', (table) => {
      table.dropColumn('route_id');
    });
  }

  // Add bus_routes_id if not exists
  const hasBusRoutesIdInTrips = await knex.schema.hasColumn('trips', 'bus_routes_id');
  if (!hasBusRoutesIdInTrips) {
    await knex.schema.alterTable('trips', (table) => {
      table.uuid('bus_routes_id').references('id').inTable('bus_routes').onDelete('CASCADE');
    });
  }

  // 3. Update templates table
  // Drop route_id if exists
  const hasRouteIdInTemplates = await knex.schema.hasColumn('templates', 'route_id');
  if (hasRouteIdInTemplates) {
    await knex.schema.alterTable('templates', (table) => {
      table.dropColumn('route_id');
    });
  }

  // Drop type_bus_id if exists
  const hasTypeBusIdInTemplates = await knex.schema.hasColumn('templates', 'type_bus_id');
  if (hasTypeBusIdInTemplates) {
    await knex.schema.alterTable('templates', (table) => {
      table.dropColumn('type_bus_id');
    });
  }

  // Add bus_routes_id if not exists
  const hasBusRoutesIdInTemplates = await knex.schema.hasColumn('templates', 'bus_routes_id');
  if (!hasBusRoutesIdInTemplates) {
    await knex.schema.alterTable('templates', (table) => {
      table.uuid('bus_routes_id').references('id').inTable('bus_routes').onDelete('CASCADE');
    });
  }

  // Add bus_id if not exists
  const hasBusIdInTemplates = await knex.schema.hasColumn('templates', 'bus_id');
  if (!hasBusIdInTemplates) {
    await knex.schema.alterTable('templates', (table) => {
      table.uuid('bus_id').references('id').inTable('buses').onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Rollback routes changes
  const hasStatusInRoutes = await knex.schema.hasColumn('routes', 'status');
  if (hasStatusInRoutes) {
    await knex.schema.alterTable('routes', (table) => {
      table.dropColumn('status');
    });
  }

  const hasCreatedByInRoutes = await knex.schema.hasColumn('routes', 'created_by');
  if (hasCreatedByInRoutes) {
    await knex.schema.alterTable('routes', (table) => {
      table.dropColumn('created_by');
    });
  }

  // Rollback trips changes
  const hasBusRoutesIdInTrips = await knex.schema.hasColumn('trips', 'bus_routes_id');
  if (hasBusRoutesIdInTrips) {
    await knex.schema.alterTable('trips', (table) => {
      table.dropColumn('bus_routes_id');
    });
  }

  await knex.schema.alterTable('trips', (table) => {
    table.uuid('route_id').references('id').inTable('routes').onDelete('CASCADE');
  });

  // Rollback templates changes
  const hasBusRoutesIdInTemplates = await knex.schema.hasColumn('templates', 'bus_routes_id');
  if (hasBusRoutesIdInTemplates) {
    await knex.schema.alterTable('templates', (table) => {
      table.dropColumn('bus_routes_id');
    });
  }

  const hasBusIdInTemplates = await knex.schema.hasColumn('templates', 'bus_id');
  if (hasBusIdInTemplates) {
    await knex.schema.alterTable('templates', (table) => {
      table.dropColumn('bus_id');
    });
  }

  await knex.schema.alterTable('templates', (table) => {
    table.uuid('route_id').references('id').inTable('routes').onDelete('CASCADE');
    table.uuid('type_bus_id').references('id').inTable('type_buses').onDelete('CASCADE');
  });
}
