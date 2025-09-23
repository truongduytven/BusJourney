import knex from './db'

export const checkDatabaseTables = async () => {
  try {
    // Kiểm tra các bảng có tồn tại không
    const tables = await knex.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    // Kiểm tra bảng bus_companies cụ thể
    const busCompaniesExists = await knex.schema.hasTable('bus_companies')
    console.log('🏢 bus_companies table exists:', busCompaniesExists)

    if (!busCompaniesExists) {
      console.log('❌ Table bus_companies does not exist. Please run migrations first.')
    }

    return tables.rows
  } catch (error) {
    console.error('❌ Error checking database tables:', error)
    throw error
  }
}

export default checkDatabaseTables
