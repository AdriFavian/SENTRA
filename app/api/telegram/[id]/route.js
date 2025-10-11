import { NextResponse } from 'next/server'
import telegramService from '@/services/telegramService'

/**
 * POST - Handle button callback (when user presses Handle/Reject)
 * Body: { accidentId, action, chatId }
 */
export async function POST(request, { params }) {
  try {
    const accidentId = parseInt(params.id)
    const body = await request.json()
    const { action, chatId } = body
    
    if (!action || !chatId) {
      return NextResponse.json(
        { error: 'Action and chatId are required' },
        { status: 400 }
      )
    }
    
    if (action === 'handle') {
      // Mark accident as handled
      await telegramService.handleAccident(accidentId, chatId)
      
      // Get accident details
      const accident = await telegramService.getAccidentWithCctv(accidentId)
      
      if (accident) {
        // Notify all other recipients
        await telegramService.sendHandledNotification(accident, chatId)
      }
      
      return NextResponse.json({
        success: true,
        message: 'Accident handled successfully'
      })
    } else if (action === 'reject') {
      return NextResponse.json({
        success: true,
        message: 'Accident rejected'
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
