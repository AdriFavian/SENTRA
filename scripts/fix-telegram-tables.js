#!/usr/bin/env node

/**
 * Fix script to drop and recreate Telegram tables with correct schema
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function fixTelegramTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🔧 Fixing Telegram tables...\n')
    const client = await pool.connect()

    // Drop existing tables
    console.log('Dropping existing tables...')
    await client.query('DROP TABLE IF EXISTS telegram_notifications CASCADE')
    await client.query('DROP TABLE IF EXISTS telegram_contacts CASCADE')
    console.log('✅ Dropped old tables')

    // Recreate telegram_contacts table with correct schema
    console.log('\nCreating telegram_contacts table...')
    await client.query(`
      CREATE TABLE telegram_contacts (
        id SERIAL PRIMARY KEY,
        cctv_id INTEGER REFERENCES cctvs(id) ON DELETE CASCADE,
        chat_id VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(cctv_id, chat_id)
      )
    `)
    console.log('✅ Created telegram_contacts table')

    // Create telegram_notifications table
    console.log('Creating telegram_notifications table...')
    await client.query(`
      CREATE TABLE telegram_notifications (
        id SERIAL PRIMARY KEY,
        accident_id INTEGER REFERENCES accidents(id) ON DELETE CASCADE,
        chat_id VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Created telegram_notifications table')

    // Create trigger for telegram_contacts
    console.log('Creating triggers...')
    await client.query(`
      DROP TRIGGER IF EXISTS update_telegram_contacts_updated_at ON telegram_contacts;
      CREATE TRIGGER update_telegram_contacts_updated_at
        BEFORE UPDATE ON telegram_contacts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `)
    console.log('✅ Created triggers')

    // Add sample contact
    console.log('\nAdding sample contact...')
    await client.query(`
      INSERT INTO telegram_contacts (cctv_id, chat_id, phone_number, name)
      VALUES (1, '6287866301810', '087866301810', 'Emergency Contact')
      ON CONFLICT (cctv_id, chat_id) DO NOTHING
    `)
    console.log('✅ Sample contact added')

    client.release()
    console.log('\n🎉 Telegram tables fixed successfully!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the fix
if (require.main === module) {
  fixTelegramTables()
}

module.exports = { fixTelegramTables }
