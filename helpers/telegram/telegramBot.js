/**
 * Telegram Bot Server - Standalone polling service
 * Run this separately from Next.js to handle button callbacks
 * Usage: node helpers/telegram/telegramBot.js
 */

require('dotenv').config({ path: '.env.local' })
const TelegramBot = require('node-telegram-bot-api')
const { Pool } = require('pg')

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Initialize Telegram Bot with polling
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
  polling: true 
})

console.log('🤖 Telegram Bot Server Started')
console.log('📡 Listening for button callbacks...\n')

// Handle callback queries (button presses)
bot.on('callback_query', async (callbackQuery) => {
  const { data, from } = callbackQuery
  
  console.log(`📥 Callback received: ${data} from ${from.id}`)
  
  try {
    // Parse callback data: handle_<accidentId> or reject_<accidentId>
    const [action, accidentId] = data.split('_')
    
    if (action === 'handle') {
      console.log(`✅ Handling accident ${accidentId}...`)
      
      // Mark accident as handled
      const client = await pool.connect()
      try {
        await client.query(
          `UPDATE accidents 
           SET is_handled = true, handled_by = $2, handled_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [accidentId, from.id.toString()]
        )
        
        // Get accident details
        const result = await client.query(
          `SELECT 
            a.*,
            c.id as cctv_id,
            c.city as cctv_city
           FROM accidents a
           LEFT JOIN cctvs c ON a.cctv_id = c.id
           WHERE a.id = $1`,
          [accidentId]
        )
        
        if (result.rows.length > 0) {
          const accident = result.rows[0]
          
          // Send confirmation to handler
          await bot.answerCallbackQuery(callbackQuery.id, {
            text: '✅ Anda telah mengambil kecelakaan ini!',
            show_alert: true
          })
          
          console.log(`✅ Accident ${accidentId} marked as handled`)
          
          // Get all other recipients
          const notifResult = await client.query(
            `SELECT DISTINCT chat_id 
             FROM telegram_notifications
             WHERE accident_id = $1 
             AND chat_id != $2
             AND status = 'sent'`,
            [accidentId, from.id.toString()]
          )
          
          // Notify all other recipients
          const message = `✅ *KECELAKAAN SUDAH DITANGANI*

Kecelakaan yang terjadi pada:
*Waktu:* ${new Date(accident.created_at).toLocaleString('id-ID')}

Sudah ditangani oleh petugas lain.

Terima kasih atas perhatian Anda.`
          
          for (const row of notifResult.rows) {
            try {
              await bot.sendMessage(row.chat_id, message, { parse_mode: 'Markdown' })
              console.log(`📤 Notified ${row.chat_id} that accident is handled`)
            } catch (error) {
              console.error(`❌ Failed to notify ${row.chat_id}:`, error.message)
            }
          }
        }
      } finally {
        client.release()
      }
      
    } else if (action === 'reject') {
      console.log(`❌ Accident ${accidentId} rejected by ${from.id}`)
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '❌ Anda menolak kecelakaan ini',
        show_alert: true
      })
    }
  } catch (error) {
    console.error('❌ Error handling callback query:', error)
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: '❌ Terjadi kesalahan',
      show_alert: true
    })
  }
})

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  const firstName = msg.from.first_name
  
  console.log(`👋 /start from ${firstName} (${chatId})`)
  
  bot.sendMessage(
    chatId,
    `👋 Selamat datang di *SENTRA Bot*, ${firstName}!

🚨 Bot ini akan mengirimkan notifikasi kecelakaan lalu lintas secara otomatis.

📝 *Chat ID Anda:* \`${chatId}\`

💡 Berikan Chat ID ini kepada admin untuk mendaftarkan Anda sebagai penerima notifikasi.

ℹ️ Saat menerima notifikasi kecelakaan, Anda dapat:
• ✅ Menekan tombol "Tangani" jika akan menangani
• ❌ Menekan tombol "Tolak" jika tidak dapat menangani

Terima kasih telah menggunakan SENTRA! 🙏`,
    { parse_mode: 'Markdown' }
  )
})

// Handle /chatid command
bot.onText(/\/chatid/, (msg) => {
  const chatId = msg.chat.id
  
  console.log(`🆔 /chatid from ${chatId}`)
  
  bot.sendMessage(
    chatId,
    `📋 *Your Chat ID:* \`${chatId}\`

Copy this ID and provide it to the admin to register for notifications.`,
    { parse_mode: 'Markdown' }
  )
})

// Handle errors
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message)
})

bot.on('error', (error) => {
  console.error('❌ Bot error:', error.message)
})

// Get bot info
bot.getMe().then((info) => {
  console.log(`✅ Bot connected: @${info.username}`)
  console.log(`   Name: ${info.first_name}`)
  console.log(`   ID: ${info.id}`)
  console.log('\n✨ Bot is ready to receive commands and callbacks!')
}).catch((error) => {
  console.error('❌ Failed to get bot info:', error.message)
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Telegram Bot Server...')
  bot.stopPolling()
  pool.end()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down Telegram Bot Server...')
  bot.stopPolling()
  pool.end()
  process.exit(0)
})
