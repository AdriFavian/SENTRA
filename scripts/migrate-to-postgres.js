#!/usr/bin/env node

/**
 * Migration script from MongoDB to PostgreSQL
 * 
 * This script helps you migrate your existing MongoDB data to PostgreSQL.
 * Make sure you have your PostgreSQL database set up and the connection
 * string configured in your .env.local file.
 * 
 * Usage:
 * 1. Set up PostgreSQL database
 * 2. Update DATABASE_URL in .env.local
 * 3. Run: node scripts/migrate-to-postgres.js
 */

const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🔗 Connecting to PostgreSQL...')
    const client = await pool.connect()
    console.log('✅ Connected to PostgreSQL successfully')

    // Create tables
    console.log('📊 Creating tables...')

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
    console.log('✅ Created cctvs table')

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
    console.log('✅ Created accidents table')

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
    console.log('✅ Created update timestamp function')

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
    console.log('✅ Created update triggers')

    // Insert some sample data if tables are empty
    const cctvCount = await client.query('SELECT COUNT(*) FROM cctvs')
    if (parseInt(cctvCount.rows[0].count) === 0) {
      console.log('📝 Inserting sample CCTV data...')
      await client.query(`
        INSERT INTO cctvs (ip_address, latitude, longitude, status, city) VALUES
        ('http://127.0.0.1:5000/1', -7.9666, 112.6326, true, 'Kabupaten Malang'),
        ('http://127.0.0.1:5000/2', -7.9797, 112.6304, true, 'Kota Malang'),
        ('http://127.0.0.1:5000/test', -7.9553, 112.6092, true, 'Kabupaten Malang'),
        ('http://stream.cctv.malangkota.go.id/WebRTCApp/streams/982131430615781858979987.m3u8?token=null', -7.9666, 112.6326, true, 'Kota Malang')
      `)
      console.log('✅ Sample CCTV data inserted')
    }

    // Insert sample accident data if tables are empty
    const accidentCount = await client.query('SELECT COUNT(*) FROM accidents')
    if (parseInt(accidentCount.rows[0].count) === 0) {
      console.log('📝 Inserting sample accident data...')
      await client.query(`
        INSERT INTO accidents (accident_classification, photos, cctv_id, created_at) VALUES
        ('Fatal', 'snapshots/snapshot_1759581288604278.jpg', 1, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
        ('Serious', 'snapshots/snapshot_1759581289263517.jpg', 1, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
        ('Normal', 'snapshots/snapshot_1759587378590178.jpg', 2, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
        ('Serious', 'snapshots/snapshot_1759587379996322.jpg', 2, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
        ('Fatal', 'snapshots/snapshot_1759587727340538.jpg', 3, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
        ('Normal', 'snapshots/snapshot_1759587728758543.jpg', 3, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
        ('Serious', 'snapshots/snapshot_1759648019108019.jpg', 1, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
        ('Fatal', 'snapshots/snapshot_1759648061413889.jpg', 2, CURRENT_TIMESTAMP - INTERVAL '10 minutes')
      `)
      console.log('✅ Sample accident data inserted')
    }

    client.release()
    console.log('🎉 Database setup completed successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Start your Next.js application: npm run dev')
    console.log('2. Test the API endpoints to ensure everything works')
    console.log('3. If you have existing MongoDB data, you\'ll need to export it and import it manually')

  } catch (error) {
    console.error('❌ Error setting up database:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }