import { Pool } from 'pg'

let pool

export default async function connectDB() {
  if (pool) {
    return pool
  }
  
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
    
    // Test the connection
    const client = await pool.connect()
    console.log('PostgreSQL Connected successfully')
    client.release()
    
    // Create tables if they don't exist
    await createTables()
    
    return pool
  } catch (e) {
    console.error(`Database connection error: ${e.message}`)
    throw e
  }
}

async function createTables() {
  const client = await pool.connect()
  
  try {
    // Create cctvs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cctvs (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(255) UNIQUE NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        status BOOLEAN DEFAULT true NOT NULL,
        city VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create accidents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS accidents (
        id SERIAL PRIMARY KEY,
        accident_classification VARCHAR(50) DEFAULT '' CHECK (accident_classification IN ('Fatal', 'Serious', 'Normal', '')),
        photos TEXT NOT NULL,
        cctv_id INTEGER REFERENCES cctvs(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create function to update updated_at timestamp
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `)
    
    // Create triggers for updated_at
    await client.query(`
      DROP TRIGGER IF EXISTS update_cctvs_updated_at ON cctvs;
      CREATE TRIGGER update_cctvs_updated_at
        BEFORE UPDATE ON cctvs
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `)
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_accidents_updated_at ON accidents;
      CREATE TRIGGER update_accidents_updated_at
        BEFORE UPDATE ON accidents
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `)
    
    console.log('Database tables created/verified successfully')
  } catch (error) {
    console.error('Error creating tables:', error.message)
    throw error
  } finally {
    client.release()
  }
}

export { pool }
