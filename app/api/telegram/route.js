import { NextResponse } from 'next/server'
import telegramService from '@/services/telegramService'

/**
 * GET - Test Telegram service
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      message: 'Telegram service is running',
      configured: !!process.env.TELEGRAM_BOT_TOKEN
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST - Send test Telegram message
 * Body: { chatId, message }
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { chatId, message, imageUrl } = body
    
    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'Chat ID and message are required' },
        { status: 400 }
      )
    }
    
    const result = await telegramService.sendMessage(
      chatId,
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
