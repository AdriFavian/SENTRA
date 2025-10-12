import { NextResponse } from 'next/server'
import telegramService from '@/services/telegramService'

/**
 * DELETE - Remove Telegram contact
 */
export async function DELETE(request, { params }) {
  try {
    const contactId = parseInt(params.contactId)
    
    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: 'Invalid contact ID' },
        { status: 400 }
      )
    }
    
    await telegramService.removeCctvContact(contactId)
    
    return NextResponse.json({ 
      success: true,
      message: 'Contact removed successfully'
    })
  } catch (error) {
    console.error('Error removing contact:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
