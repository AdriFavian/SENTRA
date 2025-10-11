#!/usr/bin/env node

/**
 * Quick setup script for Telegram notification system
 * 
 * This script will:
 * 1. Verify environment configuration
 * 2. Create database tables
 * 3. Add sample contact for testing
 * 
 * Usage: node scripts/setup-telegram.js
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function setupTelegram() {
  console.log('🚀 Setting up Telegram Notification System\n')
  console.log('='.repeat(50))
  
  // Step 1: Check environment
  console.log('\nStep 1: Checking environment variables...')
  
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('❌ TELEGRAM_BOT_TOKEN not found in .env.local')
    console.log('Please add: TELEGRAM_BOT_TOKEN=your_bot_token_here')
    process.exit(1)
  }
  console.log('✅ TELEGRAM_BOT_TOKEN configured')
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found')
    process.exit(1)
  }
  console.log('✅ DATABASE_URL configured')
  
  // Step 2: Connect to database
  console.log('\nStep 2: Connecting to PostgreSQL...')
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  
  let client
  try {
    client = await pool.connect()
    console.log('✅ Connected to PostgreSQL')
    
    // Step 3: Create tables
    console.log('\nStep 3: Creating Telegram tables...')
    
    // Create telegram_contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS telegram_contacts (
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
    await client.query(`
      CREATE TABLE IF NOT EXISTS telegram_notifications (
        id SERIAL PRIMARY KEY,
        accident_id INTEGER REFERENCES accidents(id) ON DELETE CASCADE,
        chat_id VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Created telegram_notifications table')
    
    // Step 4: Add sample contact
    console.log('\nStep 4: Adding sample Telegram contact...')
    
    // Get first CCTV
    const cctvResult = await client.query('SELECT id FROM cctvs LIMIT 1')
    
    if (cctvResult.rows.length === 0) {
      console.log('⚠️  No CCTVs found. Please add CCTVs first.')
      console.log('You can run: node scripts/migrate-to-postgres.js')
    } else {
      const cctvId = cctvResult.rows[0].id
      
      // Add sample contact (using your number)
      await client.query(`
        INSERT INTO telegram_contacts (cctv_id, chat_id, phone_number, name)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (cctv_id, chat_id) DO UPDATE 
        SET is_active = true, name = EXCLUDED.name
      `, [cctvId, '6287866301810', '087866301810', 'Emergency Contact'])
      
      console.log('✅ Sample contact added')
      console.log(`   CCTV ID: ${cctvId}`)
      console.log('   Chat ID: 6287866301810')
      console.log('   Phone: 087866301810')
    }
    
    // Step 5: Test bot connection
    console.log('\nStep 5: Testing Telegram Bot...')
    
    const TelegramBot = require('node-telegram-bot-api')
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)
    
    try {
      const me = await bot.getMe()
      console.log('✅ Telegram Bot connected successfully!')
      console.log(`   Bot Name: ${me.first_name}`)
      console.log(`   Bot Username: @${me.username}`)
    } catch (error) {
      console.log('❌ Failed to connect to Telegram Bot:', error.message)
    }
    
    // Done!
    console.log('\n' + '='.repeat(50))
    console.log('🎉 Telegram Notification System Setup Complete!\n')
    console.log('Next steps:')
    console.log('1. Start a chat with your bot: @' + (await bot.getMe()).username)
    console.log('2. Send /start to the bot')
    console.log('3. Start your application: npm run dev')
    console.log('4. Test accident detection to receive notifications')
    console.log('\nNote: For testing, you can use:')
    console.log('   node scripts/test-telegram.js')
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  } finally {
    if (client) client.release()
    await pool.end()
  }
}

// Run the setup
if (require.main === module) {
  setupTelegram()
}

module.exports = { setupTelegram }
