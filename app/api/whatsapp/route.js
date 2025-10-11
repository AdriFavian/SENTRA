import { NextResponse } from 'next/server'
import whatsappService from '@/services/whatsappService'

/**
 * GET - Test WhatsApp service
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      message: 'WhatsApp service is running',
      configured: !!process.env.FONNTE_TOKEN
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST - Send test WhatsApp message
 * Body: { phoneNumber, message }
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { phoneNumber, message, imageUrl } = body
    
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      )
    }
    
    const result = await whatsappService.sendMessage(
      phoneNumber,
      message,
      imageUrl
    )
    
    return NextResponse.json({
      success: result.success,
      data: result
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
