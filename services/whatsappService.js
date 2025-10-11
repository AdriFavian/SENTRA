import connectDB from '@/utils/connectDB'

/**
 * WhatsApp Notification Service using Fonnte API
 * Handles sending accident notifications with images and interactive buttons
 */

class WhatsAppService {
  constructor() {
    this.apiUrl = 'https://api.fonnte.com/send'
    this.token = process.env.FONNTE_TOKEN
    
    if (!this.token) {
      console.warn('⚠️ FONNTE_TOKEN not configured in environment variables')
    }
  }

  /**
   * Format phone number to international format (62xxx)
   * @param {string} phone - Phone number (e.g., 087858520937 or 6287858520937)
   * @returns {string} - Formatted phone number (6287858520937)
   */
  formatPhoneNumber(phone) {
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
   * Get WhatsApp contacts for a CCTV
   * @param {number} cctvId - CCTV ID
   * @returns {Array} - Array of contact objects
   */
  async getCctvContacts(cctvId) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `SELECT * FROM whatsapp_contacts 
         WHERE cctv_id = $1 AND is_active = true 
         ORDER BY created_at ASC`,
        [cctvId]
      )
      
      return result.rows.map(row => ({
        id: row.id,
        phoneNumber: row.phone_number,
        name: row.name,
        cctvId: row.cctv_id
      }))
    } finally {
      client.release()
    }
  }

  /**
   * Add WhatsApp contact to CCTV
   * @param {number} cctvId - CCTV ID
   * @param {string} phoneNumber - Phone number
   * @param {string} name - Contact name (optional)
   * @returns {Object} - Created contact
   */
  async addCctvContact(cctvId, phoneNumber, name = null) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    const formattedPhone = this.formatPhoneNumber(phoneNumber)
    
    try {
      const result = await client.query(
        `INSERT INTO whatsapp_contacts (cctv_id, phone_number, name) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (cctv_id, phone_number) 
         DO UPDATE SET is_active = true, name = EXCLUDED.name
         RETURNING *`,
        [cctvId, formattedPhone, name]
      )
      
      return {
        id: result.rows[0].id,
        phoneNumber: result.rows[0].phone_number,
        name: result.rows[0].name,
        cctvId: result.rows[0].cctv_id
      }
    } finally {
      client.release()
    }
  }

  /**
   * Remove WhatsApp contact from CCTV
   * @param {number} contactId - Contact ID
   */
  async removeCctvContact(contactId) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      await client.query(
        'UPDATE whatsapp_contacts SET is_active = false WHERE id = $1',
        [contactId]
      )
    } finally {
      client.release()
    }
  }

  /**
   * Send WhatsApp message with image and buttons using Fonnte API
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} message - Message text
   * @param {string} imageUrl - Full URL to image
   * @param {Array} buttons - Array of button objects
   * @returns {Promise<Object>} - API response
   */
  async sendMessage(phoneNumber, message, imageUrl = null, buttons = null) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber)
    
    const payload = {
      target: formattedPhone,
      message: message,
      countryCode: '62'
    }
    
    // Add image if provided
    if (imageUrl) {
      payload.url = imageUrl
    }
    
    // Add buttons if provided
    if (buttons && buttons.length > 0) {
      // Fonnte button format
      payload.buttons = JSON.stringify(buttons)
    }
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (data.status) {
        console.log(`✅ WhatsApp sent to ${formattedPhone}`)
        return { success: true, data }
      } else {
        console.error(`❌ Failed to send WhatsApp to ${formattedPhone}:`, data)
        return { success: false, error: data }
      }
    } catch (error) {
      console.error('❌ Error sending WhatsApp:', error)
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
    const contacts = await this.getCctvContacts(cctv._id)
    
    if (contacts.length === 0) {
      console.log(`⚠️ No WhatsApp contacts configured for CCTV ${cctv._id}`)
      return []
    }
    
    // Generate Google Maps link
    const mapsLink = this.generateMapsLink(
      cctv.location.latitude,
      cctv.location.longitude
    )
    
    // Create full image URL - use NGROK_URL if available for public access
    const baseUrl = process.env.NGROK_URL || process.env.NEXT_PUBLIC_APP_URL
    const imageUrl = `${baseUrl}/${accident.photos}`
    
    console.log(`📸 Image URL for WhatsApp: ${imageUrl}`)
    
    // Create Indonesian urgent message
    const message = `🚨 *PERINGATAN KECELAKAAN LALU LINTAS* 🚨

*Lokasi:* ${cctv.city}
*Klasifikasi:* ${accident.accidentClassification}
*Waktu:* ${new Date(accident.createdAt).toLocaleString('id-ID')}

📍 *Lokasi GPS:*
${mapsLink}

⚠️ *SEGERA DIBUTUHKAN BANTUAN!*

Mohon segera konfirmasi apakah Anda akan menangani kecelakaan ini.`
    
    // Create interactive buttons
    const buttons = [
      {
        id: `handle_${accident._id}`,
        text: '✅ Tangani'
      },
      {
        id: `reject_${accident._id}`,
        text: '❌ Tolak'
      }
    ]
    
    // Send to all contacts and log notifications
    const results = await Promise.all(
      contacts.map(async (contact) => {
        const result = await this.sendMessage(
          contact.phoneNumber,
          message,
          imageUrl,
          buttons
        )
        
        // Log notification to database
        await this.logNotification(
          accident._id,
          contact.phoneNumber,
          result.success ? 'sent' : 'failed'
        )
        
        return {
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
   * @param {string} handledByPhone - Phone number of person who handled it
   * @returns {Promise<Array>} - Array of send results
   */
  async sendHandledNotification(accident, handledByPhone) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      // Get all recipients except the one who handled it
      const result = await client.query(
        `SELECT DISTINCT wn.phone_number 
         FROM whatsapp_notifications wn
         WHERE wn.accident_id = $1 
         AND wn.phone_number != $2
         AND wn.status = 'sent'`,
        [accident._id, handledByPhone]
      )
      
      const recipients = result.rows.map(r => r.phone_number)
      
      if (recipients.length === 0) {
        return []
      }
      
      const message = `✅ *KECELAKAAN SUDAH DITANGANI*

Kecelakaan yang terjadi pada:
*Waktu:* ${new Date(accident.createdAt).toLocaleString('id-ID')}

Sudah ditangani oleh petugas lain.

Terima kasih atas perhatian Anda.`
      
      // Send to all other recipients
      const results = await Promise.all(
        recipients.map(phone => this.sendMessage(phone, message))
      )
      
      return results
    } finally {
      client.release()
    }
  }

  /**
   * Log notification to database
   * @param {number} accidentId
   * @param {string} phoneNumber
   * @param {string} status
   */
  async logNotification(accidentId, phoneNumber, status = 'sent') {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      await client.query(
        `INSERT INTO whatsapp_notifications (accident_id, phone_number, status) 
         VALUES ($1, $2, $3)`,
        [accidentId, phoneNumber, status]
      )
    } finally {
      client.release()
    }
  }

  /**
   * Mark accident as handled
   * @param {number} accidentId
   * @param {string} handledByPhone
   */
  async handleAccident(accidentId, handledByPhone) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      await client.query(
        `UPDATE accidents 
         SET is_handled = true, handled_by = $2
         WHERE id = $1`,
        [accidentId, handledByPhone]
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
          c.stream_url as cctv_ip_address,
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
        _id: row.id,
        accidentClassification: row.accident_classification,
        photos: row.photos,
        createdAt: row.created_at,
        isHandled: row.is_handled,
        handledBy: row.handled_by,
        cctv: row.cctv_id ? {
          _id: row.cctv_id,
          ipAddress: row.cctv_ip_address,
          location: {
            latitude: parseFloat(row.cctv_latitude),
            longitude: parseFloat(row.cctv_longitude)
          },
          city: row.cctv_city
        } : null
      }
    } finally {
      client.release()
    }
  }
}

export default new WhatsAppService()
