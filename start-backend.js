#!/usr/bin/env node

/**
 * Production Backend Starter
 * Runs Socket.IO and prepares for Flask backend
 * Use this script when running backend on laptop for Vercel frontend
 */

require('dotenv').config({ path: '.env.local' })
const { spawn } = require('child_process')

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🚀 SENTRA Production Backend Starter')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('')

// Start Socket.IO Server
console.log('📡 Starting Socket.IO Server...')
const socketServer = spawn('node', ['./helpers/socket/socket.js'], {
  stdio: 'inherit',
  shell: true
})

socketServer.on('error', (error) => {
  console.error('❌ Socket.IO Server error:', error)
})

// Start Telegram Bot
console.log('🤖 Starting Telegram Bot...')
const telegramBot = spawn('node', ['telegram-bot.js'], {
  stdio: 'inherit',
  shell: true
})

telegramBot.on('error', (error) => {
  console.error('❌ Telegram Bot error:', error)
})

console.log('')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('✅ Backend services started!')
console.log('')
console.log('📋 Next steps:')
console.log('   1. Start Flask backend: python app.py')
console.log('   2. Start ngrok tunnels: ngrok start --all --config ngrok.yml')
console.log('   3. Update Vercel environment variables with ngrok URLs')
console.log('')
console.log('Press Ctrl+C to stop all services')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down backend services...')
  socketServer.kill()
  telegramBot.kill()
  process.exit(0)
})
