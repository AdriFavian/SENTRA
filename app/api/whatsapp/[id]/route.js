import { NextResponse } from 'next/server'
import whatsappService from '@/services/whatsappService'

/**
 * POST - Handle or Reject accident
 * Params: id (accident ID)
 * Body: { action: 'handle' | 'reject', phoneNumber }
 */
export async function POST(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { action, phoneNumber } = body
    
    if (!action || !phoneNumber) {
      return NextResponse.json(
        { error: 'Action and phone number are required' },
        { status: 400 }
      )
    }
    
    // Get accident details
    const accident = await whatsappService.getAccidentWithCctv(id)
    
    if (!accident) {
      return NextResponse.json(
        { error: 'Accident not found' },
        { status: 404 }
      )
    }
    
    // Check if already handled
    if (accident.isHandled && action === 'handle') {
      return NextResponse.json(
        { 
          error: 'Accident already handled',
          handledBy: accident.handledBy
        },
        { status: 409 }
      )
    }
    
    if (action === 'handle') {
      // Mark as handled
      await whatsappService.handleAccident(id, phoneNumber)
      
      // Notify other recipients
      await whatsappService.sendHandledNotification(accident, phoneNumber)
      
      return NextResponse.json({
        success: true,
        message: 'Accident marked as handled and notifications sent'
      })
    } else if (action === 'reject') {
      return NextResponse.json({
        success: true,
        message: 'Rejection recorded'
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error handling WhatsApp response:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
