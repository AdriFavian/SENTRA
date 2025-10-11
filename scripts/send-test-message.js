#!/usr/bin/env node

/**
 * Send test message to verify Chat ID
 */

require('dotenv').config({ path: '.env.local' })
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false })

const chatId = '7623040522' // Your actual Chat ID from the logs

console.log('📤 Sending test message to Chat ID:', chatId)

bot.sendMessage(chatId, `✅ *TEST MESSAGE SUCCESS!*

🎉 Your Chat ID is: \`${chatId}\`

This is your REAL Chat ID that you should use in the system.

The bot IS working correctly! 🚀

📝 To add yourself to receive notifications:
1. Update database with this Chat ID: ${chatId}
2. Or use the UI to add contact with Chat ID: ${chatId}

Try sending /start again - you should receive a response!`, 
  { parse_mode: 'Markdown' }
)
.then(() => {
  console.log('✅ Test message sent successfully!')
  console.log('\n📋 Your Chat ID: 7623040522')
  console.log('\nUpdate your database:')
  console.log(`UPDATE telegram_contacts SET chat_id = '7623040522' WHERE phone_number = '087866301810';`)
  process.exit(0)
})
.catch((error) => {
  console.error('❌ Failed to send message:', error.message)
  process.exit(1)
})
