import { Knex } from 'knex'

/**
 * Migration to create bus_routes entries and populate existing templates/trips
 * - For every route, create one bus_routes row paired with a randomly chosen bus_company
 * - Set trips.bus_routes_id based on their route_id
 * - For templates without bus_routes_id, assign a random bus_routes and set company_id accordingly
 * NOTE: templates.bus_id is left NULL; client will be required to provide bus_id for new templates.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    // Ensure bus_routes table exists (in case initial schema migration wasn't applied)
    const hasBusRoutes = await trx.schema.hasTable('bus_routes')
    if (!hasBusRoutes) {
      await trx.schema.createTable('bus_routes', (t) => {
        t.uuid('id').primary().defaultTo(trx.raw('gen_random_uuid()'))
        t.uuid('route_id').references('routes.id').notNullable()
        t.uuid('bus_company_id').references('bus_companies.id').notNullable()
        t.boolean('status').defaultTo(true)
      })
    }
    // load routes and bus companies
    const routes = await trx('routes').select('id')
    const companies = await trx('bus_companies').select('id')

    if (!companies || companies.length === 0) {
      console.warn('No bus_companies found; skipping bus_routes creation')
      return
    }

    // Ensure trips table has bus_routes_id column (add if absent)
    const hasTripsBusRoutesCol = await trx.schema.hasColumn('trips', 'bus_routes_id')
    if (!hasTripsBusRoutesCol) {
      await trx.schema.alterTable('trips', (t) => {
        t.uuid('bus_routes_id').references('bus_routes.id')
      })
    }

    // Ensure templates table has bus_routes_id and company_id columns (add if absent)
    const hasTemplatesBusRoutesCol = await trx.schema.hasColumn('templates', 'bus_routes_id')
    if (!hasTemplatesBusRoutesCol) {
      await trx.schema.alterTable('templates', (t) => {
        t.uuid('bus_routes_id').references('bus_routes.id')
      })
    }
    const hasTemplatesCompanyCol = await trx.schema.hasColumn('templates', 'company_id')
    if (!hasTemplatesCompanyCol) {
      await trx.schema.alterTable('templates', (t) => {
        t.uuid('company_id').references('bus_companies.id')
      })
    }

    // Create bus_routes for each route paired with a random company
    const routeToBusRouteMap: Record<string, string> = {}

    for (const r of routes) {
      const randomCompany = companies[Math.floor(Math.random() * companies.length)]
      const [inserted] = await trx('bus_routes')
        .insert({ route_id: r.id, bus_company_id: randomCompany.id, status: true })
        .returning('id')

      // Some DBs return object, some return id directly
      const busRouteId = typeof inserted === 'object' && inserted.id ? inserted.id : inserted
      routeToBusRouteMap[r.id] = busRouteId
    }

    // Update trips: set bus_routes_id based on route_id when missing
    await trx('trips')
      .whereNull('bus_routes_id')
      .whereNotNull('route_id')
      .select('id', 'route_id')
      .then(async (rows: Array<{ id: string; route_id: string }>) => {
        for (const row of rows) {
          const br = routeToBusRouteMap[row.route_id]
          if (br) {
            await trx('trips').where('id', row.id).update({ bus_routes_id: br })
          }
        }
      })

    // Assign bus_routes_id and company_id for templates that don't have them yet
    const templates = await trx('templates').select('id')

    const busRoutesList = await trx('bus_routes').select('id', 'bus_company_id')

    for (const t of templates) {
      // If template already has a bus_routes_id, skip
      const existing = await trx('templates').where('id', t.id).first()
      if (existing && existing.bus_routes_id) continue

      // pick a random bus_route
      const br = busRoutesList[Math.floor(Math.random() * busRoutesList.length)]
      if (!br) continue

      await trx('templates').where('id', t.id).update({ bus_routes_id: br.id, company_id: br.bus_company_id })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  // This migration populated bus_routes and updated trips/templates in a best-effort way.
  // Manual rollback is recommended. We intentionally leave down empty to avoid accidental data loss.
  return Promise.resolve()
}
