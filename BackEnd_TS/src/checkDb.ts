import knex from './db'

export const checkDatabaseTables = async () => {
  try {
    const tables = await knex.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    return tables.rows
  } catch (error) {
    console.error('❌ Error checking database tables:', error)
    throw error
  }
}

export default checkDatabaseTables
