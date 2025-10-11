#!/usr/bin/env node

/**
 * Fix Chat ID in database - Replace phone number format with real Chat ID
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function fixChatId() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🔧 Updating Chat ID in database...\n')
    const client = await pool.connect()

    // Update the incorrect chat_id
    const result = await client.query(`
      UPDATE telegram_contacts 
      SET chat_id = $1 
      WHERE phone_number = $2
      RETURNING *
    `, ['7623040522', '087866301810'])

    if (result.rows.length > 0) {
      console.log('✅ Chat ID updated successfully!')
      console.log('\nUpdated contact:')
      console.log(result.rows[0])
    } else {
      console.log('⚠️ No matching contact found. Adding new contact...')
      
      // Get first CCTV
      const cctvResult = await client.query('SELECT id FROM cctvs LIMIT 1')
      
      if (cctvResult.rows.length > 0) {
        const cctvId = cctvResult.rows[0].id
        
        const insertResult = await client.query(`
          INSERT INTO telegram_contacts (cctv_id, chat_id, phone_number, name)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (cctv_id, chat_id) DO UPDATE 
          SET phone_number = EXCLUDED.phone_number, name = EXCLUDED.name
          RETURNING *
        `, [cctvId, '7623040522', '087866301810', 'Noklent'])
        
        console.log('✅ Contact added/updated:')
        console.log(insertResult.rows[0])
      }
    }

    // Show all contacts
    console.log('\n📋 All Telegram contacts:')
    const allContacts = await client.query('SELECT * FROM telegram_contacts WHERE is_active = true')
    console.table(allContacts.rows)

    client.release()
    console.log('\n🎉 Database updated successfully!')
    console.log('\n📝 Your correct Chat ID: 7623040522')
    console.log('✅ You can now receive Telegram notifications!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the fix
if (require.main === module) {
  fixChatId()
}

module.exports = { fixChatId }
