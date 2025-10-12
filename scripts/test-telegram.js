#!/usr/bin/env node

/**
 * Test script for Telegram notification system
 * 
 * This script helps you test the Telegram integration:
 * 1. Add test contacts to a CCTV
 * 2. Send test notification
 * 3. Test handling accident
 * 
 * Usage: node scripts/test-telegram.js
 */

require('dotenv').config({ path: '.env.local' })

const testTelegram = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const NGROK_URL = process.env.NGROK_URL
  
  console.log('🧪 Testing Telegram Notification System\n')
  console.log('='.repeat(50))
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Ngrok URL: ${NGROK_URL || '❌ Not configured'}`)
  console.log(`Telegram Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Configured' : '❌ Not configured'}`)
  console.log('='.repeat(50))
  
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('\n❌ TELEGRAM_BOT_TOKEN not configured!')
    console.log('Please add TELEGRAM_BOT_TOKEN to your .env.local file')
    return
  }
  
  // Test 1: Check Telegram service
  console.log('\n📋 Test 1: Checking Telegram service...')
  try {
    const response = await fetch(`${BASE_URL}/api/telegram`)
    const data = await response.json()
    console.log('✅ Service status:', data)
  } catch (error) {
    console.log('❌ Failed to check service:', error.message)
    console.log('Make sure your Next.js server is running (npm run dev)')
    return
  }
  
  // Test 2: Get bot info
  console.log('\n📋 Test 2: Getting bot information...')
  try {
    const TelegramBot = require('node-telegram-bot-api')
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)
    const me = await bot.getMe()
    console.log('✅ Bot connected!')
    console.log(`   Name: ${me.first_name}`)
    console.log(`   Username: @${me.username}`)
    console.log(`   ID: ${me.id}`)
    console.log('\n💡 To receive notifications:')
    console.log(`   1. Search for @${me.username} in Telegram`)
    console.log('   2. Send /start to the bot')
    console.log('   3. Your chat ID will be your Telegram user ID')
  } catch (error) {
    console.log('❌ Failed to get bot info:', error.message)
    return
  }
  
  // Test 3: Add contact to CCTV
  console.log('\n📋 Test 3: Adding test contact to CCTV...')
  try {
    const cctvId = 1 // Using first CCTV
    const chatId = '6287866301810' // Your test number as chat ID
    
    const response = await fetch(`${BASE_URL}/api/telegram/cctv/${cctvId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: chatId,
        phoneNumber: '087866301810',
        name: 'Test Contact'
      })
    })
    
    const data = await response.json()
    console.log('✅ Contact added:', data)
  } catch (error) {
    console.log('❌ Failed to add contact:', error.message)
  }
  
  // Test 4: Get contacts for CCTV
  console.log('\n📋 Test 4: Getting contacts for CCTV...')
  try {
    const cctvId = 1
    const response = await fetch(`${BASE_URL}/api/telegram/cctv/${cctvId}`)
    const data = await response.json()
    console.log('✅ Contacts:', data)
  } catch (error) {
    console.log('❌ Failed to get contacts:', error.message)
  }
  
  // Test 5: Send test message
  console.log('\n📋 Test 5: Sending test message...')
  try {
    const chatId = '6287866301810'
    const testMessage = `🧪 *TEST MESSAGE*

This is a test notification from SENTRA Telegram Bot.

If you receive this, the integration is working! ✅

Time: ${new Date().toLocaleString('id-ID')}`
    
    const response = await fetch(`${BASE_URL}/api/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: chatId,
        message: testMessage
      })
    })
    
    const data = await response.json()
    if (data.success) {
      console.log('✅ Test message sent successfully!')
      console.log('   Check your Telegram for the message')
    } else {
      console.log('❌ Failed to send:', data.error)
    }
  } catch (error) {
    console.log('❌ Failed to send test message:', error.message)
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('🎉 Testing complete!')
  console.log('\nImportant Notes:')
  console.log('1. Chat IDs in Telegram are numeric user/chat identifiers')
  console.log('2. Users must start a conversation with your bot first')
  console.log('3. To get a user\'s chat ID, they need to send a message to the bot')
  console.log('4. For production, implement a /start command to register users')
  console.log('\n💡 Tip: Use @Sentra_message_bot in Telegram to get your chat ID')
}

// Run the test
if (require.main === module) {
  testTelegram().catch(console.error)
}

module.exports = { testTelegram }
