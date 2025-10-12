import { NextResponse } from 'next/server'
import telegramService from '@/services/telegramService'
import connectDB from '@/utils/connectDB'

/**
 * POST - Send test notification to a specific contact
 * This is used to verify Telegram connection is working
 */
export async function POST(request, { params }) {
  try {
    const contactId = parseInt(params.contactId)
    
    // Get contact details from database
    const pool = await connectDB()
    const client = await pool.connect()
    
    let contact
    try {
      const result = await client.query(
        `SELECT tc.*, c.city as cctv_city 
         FROM telegram_contacts tc
         LEFT JOIN cctvs c ON tc.cctv_id = c.id
         WHERE tc.id = $1`,
        [contactId]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        )
      }
      
      contact = result.rows[0]
    } finally {
      client.release()
    }
    
    // Create test message
    const message = `🔔 *Test Notification from SENTRA*

Hello ${contact.name || 'there'}! 👋

This is a test message to confirm your Telegram connection is working properly.

*Camera:* ${contact.cctv_city}
*Chat ID:* ${contact.chat_id}

✅ If you're seeing this, notifications are configured correctly!

You will receive accident alerts from this camera at this number.`
    
    // Send test message
    const result = await telegramService.sendMessage(
      contact.chat_id,
      message
    )
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test notification sent successfully'
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send notification' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending test notification:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
