#!/usr/bin/env node

/**
 * Script to help you get your Telegram Chat ID and update the database
 * 
 * Usage: node scripts/get-telegram-chatid.js
 */

require('dotenv').config({ path: '.env.local' })
const TelegramBot = require('node-telegram-bot-api')
const { Pool } = require('pg')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('🔍 Telegram Chat ID Helper\n')
  console.log('='.repeat(50))
  
  // Step 1: Initialize bot
  console.log('\nStep 1: Connecting to Telegram Bot...')
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false })
  
  try {
    const me = await bot.getMe()
    console.log(`✅ Bot connected: @${me.username}`)
    console.log(`   Bot Name: ${me.first_name}`)
  } catch (error) {
    console.error('❌ Failed to connect to bot:', error.message)
    process.exit(1)
  }
  
  // Step 2: Instructions
  console.log('\n' + '='.repeat(50))
  console.log('📱 HOW TO GET YOUR CHAT ID:\n')
  console.log('Option 1: Use @Sentra_message_bot')
  console.log('  1. Open Telegram')
  console.log('  2. Search for: @Sentra_message_bot')
  console.log('  3. Send: /start')
  console.log('  4. Copy the number it gives you\n')
  
  console.log('Option 2: Use @RawDataBot')
  console.log('  1. Search for: @RawDataBot')
  console.log('  2. Send any message')
  console.log('  3. Look for "id": in the response\n')
  
  console.log('Option 3: Message your bot')
  console.log(`  1. Search for: @${(await bot.getMe()).username}`)
  console.log('  2. Send: /start')
  console.log('  3. Bot will show your Chat ID')
  console.log('\n' + '='.repeat(50))
  
  // Step 3: Get Chat ID from user
  const chatId = await question('\n📝 Enter your Chat ID: ')
  
  if (!chatId || chatId.length < 5) {
    console.log('❌ Invalid Chat ID')
    process.exit(1)
  }
  
  // Step 4: Test the Chat ID
  console.log(`\n🧪 Testing Chat ID: ${chatId}...`)
  
  try {
    await bot.sendMessage(chatId, '✅ Success! Your Chat ID works!\n\nThis is a test message from SENTRA.')
    console.log('✅ Test message sent successfully!')
  } catch (error) {
    if (error.message.includes('chat not found')) {
      console.log('❌ Chat not found! Make sure you:')
      console.log('   1. Started a chat with the bot (/start)')
      console.log('   2. Used the correct Chat ID (not phone number)')
      process.exit(1)
    } else {
      console.error('❌ Error:', error.message)
      process.exit(1)
    }
  }
  
  // Step 5: Update database
  console.log('\n📊 Updating database...')
  
  const phoneNumber = await question('Enter phone number (optional, press Enter to skip): ')
  const name = await question('Enter name (optional, press Enter to skip): ')
  const cctvId = await question('Enter CCTV ID (default: 1): ') || '1'
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  
  try {
    const client = await pool.connect()
    
    // Remove old incorrect entry if exists
    await client.query(
      'DELETE FROM telegram_contacts WHERE chat_id = $1',
      ['6287866301810'] // Remove the phone number entry
    )
    
    // Insert or update with correct Chat ID
    await client.query(
      `INSERT INTO telegram_contacts (cctv_id, chat_id, phone_number, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (cctv_id, chat_id) 
       DO UPDATE SET 
         phone_number = EXCLUDED.phone_number,
         name = EXCLUDED.name,
         is_active = true`,
      [cctvId, chatId, phoneNumber || null, name || null]
    )
    
    console.log('✅ Database updated successfully!')
    
    // Show current contacts
    const result = await client.query(
      'SELECT * FROM telegram_contacts WHERE is_active = true ORDER BY id DESC LIMIT 5'
    )
    
    console.log('\n📋 Current active contacts:')
    console.log('='.repeat(50))
    result.rows.forEach(row => {
      console.log(`ID: ${row.id}`)
      console.log(`  CCTV ID: ${row.cctv_id}`)
      console.log(`  Chat ID: ${row.chat_id}`)
      console.log(`  Phone: ${row.phone_number || 'N/A'}`)
      console.log(`  Name: ${row.name || 'N/A'}`)
      console.log('-'.repeat(50))
    })
    
    client.release()
  } catch (error) {
    console.error('❌ Database error:', error.message)
  } finally {
    await pool.end()
  }
  
  console.log('\n🎉 Setup complete!')
  console.log('\nNext steps:')
  console.log('1. Start your app: npm run dev')
  console.log('2. Start bot server: npm run telegram')
  console.log('3. Trigger accident detection to test')
  
  rl.close()
  process.exit(0)
}

main().catch(error => {
  console.error('Error:', error)
  rl.close()
  process.exit(1)
})
