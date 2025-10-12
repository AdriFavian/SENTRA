import connectDB from '../utils/connectDB.js'
import TelegramBot from 'node-telegram-bot-api'

/**
 * Telegram Notification Service using Telegram Bot API
 * Handles sending accident notifications with images and interactive buttons
 */

class TelegramService {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN
    this.bot = null
    this.isInitialized = false
    
    if (!this.token) {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN not configured in environment variables')
    } else {
      // Initialize bot without polling to avoid conflicts
      // Polling will only be enabled when explicitly needed
      this.initializeBot()
    }
  }

  /**
   * Initialize Telegram Bot (without polling by default)
   */
  initializeBot() {
    try {
      if (this.isInitialized) {
        return // Prevent multiple initializations
      }

      // Initialize bot WITHOUT polling to avoid conflicts in Next.js
      this.bot = new TelegramBot(this.token, { polling: false })
      this.isInitialized = true
      console.log('✅ Telegram Bot initialized (webhook mode)')
    } catch (error) {
      console.error('❌ Failed to initialize Telegram Bot:', error)
    }
  }

  /**
   * Start polling (only call this in standalone scripts, not in Next.js app)
   */
  startPolling() {
    if (!this.bot) {
      console.error('❌ Bot not initialized')
      return
    }

    try {
      // Stop any existing polling first
      if (this.bot.isPolling()) {
        this.bot.stopPolling()
      }

      // Start polling
      this.bot.startPolling()
      console.log('✅ Telegram Bot polling started')
      
      // Set up button callback handler
      this.setupCallbackHandler()
    } catch (error) {
      console.error('❌ Failed to start polling:', error)
    }
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.bot && this.bot.isPolling()) {
      this.bot.stopPolling()
      console.log('✅ Telegram Bot polling stopped')
    }
  }

  /**
   * Set up callback query handler for button presses
   */
  setupCallbackHandler() {
    if (!this.bot) {
      console.warn('⚠️ Cannot setup callback handler - bot not initialized')
      return
    }

    // Remove any existing listeners to prevent duplicates
    this.bot.removeAllListeners('callback_query')

    this.bot.on('callback_query', async (callbackQuery) => {
      const { data, from, message } = callbackQuery
      
      try {
        // Parse callback data: handle_<accidentId> or reject_<accidentId>
        const [action, accidentId] = data.split('_')
        
        if (action === 'handle') {
          // Mark accident as handled
          await this.handleAccident(parseInt(accidentId), from.id.toString())
          
          // Get accident details
          const accident = await this.getAccidentWithCctv(parseInt(accidentId))
          
          if (accident) {
            // Send acknowledgment to the person who pressed handle
            await this.bot.answerCallbackQuery(callbackQuery.id, {
              text: '✅ Anda telah mengambil kecelakaan ini!',
              show_alert: true
            })
            
            // Notify all other recipients
            await this.sendHandledNotification(accident, from.id.toString())
          }
        } else if (action === 'reject') {
          await this.bot.answerCallbackQuery(callbackQuery.id, {
            text: '❌ Anda menolak kecelakaan ini',
            show_alert: true
          })
        }
      } catch (error) {
        console.error('❌ Error handling callback query:', error)
        await this.bot.answerCallbackQuery(callbackQuery.id, {
          text: '❌ Terjadi kesalahan',
          show_alert: true
        })
      }
    })

    console.log('✅ Telegram callback handler registered')
  }

  /**
   * Format phone number to chat ID format
   * Note: For actual implementation, you need to store chat IDs when users interact with the bot
   * @param {string} phone - Phone number
   * @returns {string} - Chat ID (for now, we'll use phone as identifier)
   */
  formatChatId(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '')
    
    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1)
    }
    
    // If doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned
    }
    
    return cleaned
  }

  /**
   * Generate Google Maps link from coordinates
   * @param {number} latitude
   * @param {number} longitude
   * @returns {string} - Google Maps URL
   */
  generateMapsLink(latitude, longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`
  }

  /**
   * Get Telegram contacts for a CCTV
   * @param {number} cctvId - CCTV ID
   * @returns {Array} - Array of contact objects
   */
  async getCctvContacts(cctvId) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `SELECT * FROM telegram_contacts 
         WHERE cctv_id = $1 AND is_active = true 
         ORDER BY created_at ASC`,
        [cctvId]
      )
      
      return result.rows.map(row => ({
        id: row.id,
        chatId: row.chat_id,
        phoneNumber: row.phone_number,
        name: row.name,
        cctvId: row.cctv_id
      }))
    } finally {
      client.release()
    }
  }

  /**
   * Add Telegram contact to CCTV
   * @param {number} cctvId - CCTV ID
   * @param {string} chatId - Telegram chat ID
   * @param {string} phoneNumber - Phone number (optional, for reference)
   * @param {string} name - Contact name (optional)
   * @returns {Object} - Created contact
   */
  async addCctvContact(cctvId, chatId, phoneNumber = null, name = null) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `INSERT INTO telegram_contacts (cctv_id, chat_id, phone_number, name) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (cctv_id, chat_id) 
         DO UPDATE SET is_active = true, name = EXCLUDED.name, phone_number = EXCLUDED.phone_number
         RETURNING *`,
        [cctvId, chatId, phoneNumber, name]
      )
      
      return {
        id: result.rows[0].id,
        chatId: result.rows[0].chat_id,
        phoneNumber: result.rows[0].phone_number,
        name: result.rows[0].name,
        cctvId: result.rows[0].cctv_id
      }
    } finally {
      client.release()
    }
  }

  /**
   * Remove Telegram contact from CCTV
   * @param {number} contactId - Contact ID
   */
  async removeCctvContact(contactId) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      await client.query(
        'UPDATE telegram_contacts SET is_active = false WHERE id = $1',
        [contactId]
      )
    } finally {
      client.release()
    }
  }

  /**
   * Send Telegram message with photo and inline keyboard buttons
   * @param {string} chatId - Recipient chat ID
   * @param {string} message - Message text
   * @param {string} imageUrl - Full URL to image or local file path
   * @param {Array} buttons - Array of button rows
   * @returns {Promise<Object>} - API response
   */
  async sendMessage(chatId, message, imageUrl = null, buttons = null) {
    if (!this.bot) {
      console.error('❌ Telegram Bot not initialized')
      return { success: false, error: 'Bot not initialized' }
    }

    try {
      const options = {
        parse_mode: 'Markdown'
      }

      // Add inline keyboard if buttons provided
      if (buttons && buttons.length > 0) {
        options.reply_markup = {
          inline_keyboard: buttons
        }
      }

      let result
      if (imageUrl) {
        // Send photo with caption
        result = await this.bot.sendPhoto(chatId, imageUrl, {
          ...options,
          caption: message
        })
      } else {
        // Send text message only
        result = await this.bot.sendMessage(chatId, message, options)
      }

      console.log(`✅ Telegram message sent to ${chatId}`)
      return { success: true, data: result }
    } catch (error) {
      console.error(`❌ Failed to send Telegram message to ${chatId}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send accident notification to all contacts of a CCTV
   * @param {Object} accident - Accident data
   * @param {Object} cctv - CCTV data with location
   * @returns {Promise<Array>} - Array of send results
   */
  async sendAccidentNotification(accident, cctv) {
    const contacts = await this.getCctvContacts(cctv.id || cctv._id)
    
    if (contacts.length === 0) {
      console.log(`⚠️ No Telegram contacts configured for CCTV ${cctv.id || cctv._id}`)
      return []
    }
    
    // Generate Google Maps link
    const mapsLink = this.generateMapsLink(
      cctv.location?.latitude || cctv.latitude,
      cctv.location?.longitude || cctv.longitude
    )
    
    // Create full image URL or use local file path
    const baseUrl = process.env.NGROK_URL || process.env.NEXT_PUBLIC_APP_URL
    const imageUrl = accident.photos.startsWith('http') 
      ? accident.photos 
      : `${baseUrl}/${accident.photos}`
    
    console.log(`📸 Image URL for Telegram: ${imageUrl}`)
    
    // Create Indonesian urgent message
    const message = `🚨 *PERINGATAN KECELAKAAN LALU LINTAS* 🚨
*Id Laporan:* ${accident.id || accident._id}
*Lokasi:* ${cctv.city}
*Klasifikasi:* ${accident.accident_classification || accident.accidentClassification}
*Waktu:* ${new Date(accident.created_at || accident.createdAt).toLocaleString('id-ID')}

📍 *Lokasi GPS:*
${mapsLink}

⚠️ *SEGERA DIBUTUHKAN BANTUAN!*

Mohon segera konfirmasi apakah Anda akan menangani kecelakaan ini.`
    
    // Create inline keyboard buttons
    const buttons = [
      [
        {
          text: '✅ Tangani',
          callback_data: `handle_${accident.id || accident._id}`
        },
        {
          text: '❌ Tolak',
          callback_data: `reject_${accident.id || accident._id}`
        }
      ]
    ]
    
    // Send to all contacts and log notifications
    const results = await Promise.all(
      contacts.map(async (contact) => {
        const result = await this.sendMessage(
          contact.chatId,
          message,
          imageUrl,
          buttons
        )
        
        // Log notification to database
        await this.logNotification(
          accident.id || accident._id,
          contact.chatId,
          result.success ? 'sent' : 'failed'
        )
        
        return {
          chatId: contact.chatId,
          phoneNumber: contact.phoneNumber,
          name: contact.name,
          ...result
        }
      })
    )
    
    return results
  }

  /**
   * Send update notification when accident is handled
   * @param {Object} accident - Accident data
   * @param {string} handledByChatId - Chat ID of person who handled it
   * @returns {Promise<Array>} - Array of send results
   */
  async sendHandledNotification(accident, handledByChatId) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      console.log(`📢 Sending handled notification for accident ${accident.id || accident._id}`)
      console.log(`👤 Handled by chat ID: ${handledByChatId}`)
      
      // Get all recipients except the one who handled it
      const result = await client.query(
        `SELECT DISTINCT tn.chat_id 
         FROM telegram_notifications tn
         WHERE tn.accident_id = $1 
         AND tn.chat_id != $2
         AND tn.status = 'sent'`,
        [accident.id || accident._id, handledByChatId]
      )
      
      const recipients = result.rows.map(r => r.chat_id)
      
      console.log(`📋 Found ${recipients.length} recipients to notify:`, recipients)
      
      if (recipients.length === 0) {
        console.log('⚠️ No recipients found to send handled notification')
        return []
      }
      //  bukan ini
      const message = `✅ *KECELAKAAN SUDAH DITANGANI*
*ID Laporan:* ${accident.id || accident._id}

Kecelakaan yang terjadi pada:
*Lokasi:* ${accident.cctv?.city || 'Unknown'}
*Waktu:* ${new Date(accident.created_at || accident.createdAt).toLocaleString('id-ID')}

Sudah ditangani oleh petugas lain.

Terima kasih atas perhatian Anda.`
      
      // Send to all other recipients
      const results = await Promise.all(
        recipients.map(async chatId => {
          console.log(`📤 Sending handled notification to ${chatId}`)
          const result = await this.sendMessage(chatId, message)
          console.log(`${result.success ? '✅' : '❌'} Handled notification to ${chatId}: ${result.success ? 'sent' : result.error}`)
          return result
        })
      )
      
      console.log(`✅ Handled notifications sent to ${results.filter(r => r.success).length}/${recipients.length} recipients`)
      
      return results
    } catch (error) {
      console.error('❌ Error sending handled notification:', error)
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Log notification to database
   * @param {number} accidentId
   * @param {string} chatId
   * @param {string} status
   */
  async logNotification(accidentId, chatId, status = 'sent') {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      await client.query(
        `INSERT INTO telegram_notifications (accident_id, chat_id, status) 
         VALUES ($1, $2, $3)`,
        [accidentId, chatId, status]
      )
    } finally {
      client.release()
    }
  }

  /**
   * Mark accident as handled
   * @param {number} accidentId
   * @param {string} handledByChatId
   */
  async handleAccident(accidentId, handledByChatId) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      await client.query(
        `UPDATE accidents 
         SET is_handled = true, handled_by = $2, handled_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [accidentId, handledByChatId]
      )
    } finally {
      client.release()
    }
  }

  /**
   * Get accident by ID with CCTV info
   * @param {number} accidentId
   * @returns {Object} - Accident with CCTV data
   */
  async getAccidentWithCctv(accidentId) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `SELECT 
          a.*,
          c.id as cctv_id,
          c.ip_address as cctv_ip_address,
          c.latitude as cctv_latitude,
          c.longitude as cctv_longitude,
          c.city as cctv_city
         FROM accidents a
         LEFT JOIN cctvs c ON a.cctv_id = c.id
         WHERE a.id = $1`,
        [accidentId]
      )
      
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      return {
        id: row.id,
        _id: row.id,
        accident_classification: row.accident_classification,
        accidentClassification: row.accident_classification,
        photos: row.photos,
        created_at: row.created_at,
        createdAt: row.created_at,
        is_handled: row.is_handled,
        isHandled: row.is_handled,
        handled_by: row.handled_by,
        handledBy: row.handled_by,
        cctv: row.cctv_id ? {
          id: row.cctv_id,
          _id: row.cctv_id,
          ipAddress: row.cctv_ip_address,
          location: {
            latitude: parseFloat(row.cctv_latitude),
            longitude: parseFloat(row.cctv_longitude)
          },
          latitude: parseFloat(row.cctv_latitude),
          longitude: parseFloat(row.cctv_longitude),
          city: row.cctv_city
        } : null
      }
    } finally {
      client.release()
    }
  }
}

export default new TelegramService()
