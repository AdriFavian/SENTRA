/**
 * Standalone Telegram Bot Script
 * Run this separately from Next.js to handle Telegram callbacks
 * Usage: node telegram-bot.js
 */

import telegramService from './services/telegramService.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

console.log('🤖 Starting Telegram Bot in polling mode...')

// Start polling to receive updates
telegramService.startPolling()

console.log('✅ Telegram Bot is running and listening for button callbacks')
console.log('📱 Users can now press "Tangani" or "Tolak" buttons')
console.log('Press Ctrl+C to stop the bot')

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Stopping Telegram Bot...')
  telegramService.stopPolling()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n⏹️  Stopping Telegram Bot...')
  telegramService.stopPolling()
  process.exit(0)
})

// Keep the process running
setInterval(() => {
  // Just keep alive
}, 1000 * 60 * 60) // Check every hour
