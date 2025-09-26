import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Enable extensions
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`)

  // Roles
  await knex.schema.createTable('roles', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.string('name', 50).notNullable()
  })

  // Accounts
  await knex.schema.createTable('accounts', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.string('name', 50)
    t.string('avatar', 100)
    t.string('email', 50).unique().notNullable()
    t.string('phone', 10)
    t.boolean('is_verified').defaultTo(false)
    t.string('type', 20)
    t.string('address', 100)
    t.string('password', 100).notNullable()
    t.uuid('role_id').references('Roles.id')
    t.uuid('company_id')
    t.timestamp('create_at').defaultTo(knex.fn.now())
    t.boolean('is_active').defaultTo(true)
    t.string('otp_code', 6)
  })

  // Bus Companies
  await knex.schema.createTable('bus_companies', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.string('name', 50).notNullable()
    t.string('address', 100)
    t.string('phone', 10)
    t.timestamp('create_at').defaultTo(knex.fn.now())
    t.boolean('status').defaultTo(true)
  })

  // Cities
  await knex.schema.createTable('cities', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.string('name', 20).notNullable()
  })

  // Locations
  await knex.schema.createTable('locations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('city_id').references('cities.id')
    t.string('name', 20)
  })

  // TypeBuses
  await knex.schema.createTable('type_buses', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.string('name', 50).notNullable()
    t.integer('total_seats').notNullable()
    t.integer('number_rows').notNullable()
    t.integer('number_cols').notNullable()
    t.boolean('is_floors').defaultTo(false)
    t.integer('number_rows_floor')
    t.integer('number_cols_floor')
  })

  // Seats
  await knex.schema.createTable('seats', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.string('code', 5)
    t.integer('index_col')
    t.integer('index_row')
    t.integer('floor').defaultTo(1)
    t.uuid('type_bus_id').references('type_buses.id')
  })

  // Buses
  await knex.schema.createTable('buses', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('company_id').references('bus_companies.id')
    t.string('license_plate', 20).unique()
    t.uuid('type_bus_id').references('type_buses.id')
    t.jsonb('images').defaultTo('[]')
    t.jsonb('extensions').defaultTo('[]')
    t.boolean('is_active').defaultTo(true)
  })

  // Routes
  await knex.schema.createTable('routes', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('start_location_id').references('locations.id')
    t.uuid('end_location_id').references('locations.id')
    t.integer('distance_km')
  })

  // Templates
  await knex.schema.createTable('templates', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('company_id').references('bus_companies.id')
    t.uuid('route_id').references('routes.id')
    t.uuid('type_bus_id').references('type_buses.id')
    t.string('name', 50)
    t.boolean('is_active').defaultTo(true)
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Trips
  await knex.schema.createTable('trips', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('route_id').references('routes.id')
    t.uuid('template_id').references('templates.id')
    t.uuid('bus_id').references('buses.id')
    t.timestamp('departure_time')
    t.timestamp('arrival_time')
    t.decimal('price')
    t.string('status', 20)
  })

  // Points
  await knex.schema.createTable('points', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('trip_id').references('trips.id').onDelete('CASCADE').notNullable()
    t.string('type', 20).notNullable()
    t.timestamp('time').notNullable()
    t.string('locationName', 100)
  })

  // Coupons
  await knex.schema.createTable('coupons', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.text('description')
    t.string('discount_type', 20)
    t.decimal('discount_value', 12, 2)
    t.decimal('max_discount_value', 12, 2)
    t.integer('max_uses')
    t.integer('used_count').defaultTo(0)
    t.timestamp('valid_from')
    t.timestamp('valid_to')
    t.string('status', 20)
    t.uuid('company_id').references('bus_companies.id')
    t.string('create_by', 20)
  })

  // Orders
  await knex.schema.createTable('orders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('coupon_id').references('coupons.id')
    t.uuid('user_id').references('accounts.id')
    t.decimal('origin_amount', 12, 2)
    t.decimal('final_amount', 12, 2)
    t.string('status', 20)
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Tickets
  await knex.schema.createTable('tickets', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.string('ticket_code', 50).unique()
    t.uuid('order_id').references('orders.id')
    t.uuid('user_id').references('accounts.id')
    t.uuid('trip_id').references('trips.id')
    t.string('seat_code', 5)
    t.text('qr_code')
    t.string('status', 50)
    t.timestamp('purchase_date').defaultTo(knex.fn.now())
    t.timestamp('checked_date')
    t.uuid('checked_by').references('accounts.id')
    t.uuid('pickup_point_id').references('points.id')
    t.uuid('dropoff_point_id').references('points.id')
  })

  // Transactions
  await knex.schema.createTable('transactions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('order_id').references('orders.id')
    t.decimal('amount', 12, 2)
    t.string('payment_method', 20)
    t.string('status', 20)
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Reviews
  await knex.schema.createTable('reviews', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('trip_id').references('trips.id')
    t.integer('rating').checkBetween([1, 5])
    t.text('commenttext')
    t.timestamp('create_at').defaultTo(knex.fn.now())
    t.uuid('create_by').references('accounts.id')
    t.boolean('is_visible').defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropSchema('public', true).createSchema('public')
}
