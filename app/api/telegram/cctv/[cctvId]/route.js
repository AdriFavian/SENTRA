import { NextResponse } from 'next/server'
import telegramService from '@/services/telegramService'

/**
 * GET - Get all Telegram contacts for a CCTV
 */
export async function GET(request, { params }) {
  try {
    const cctvId = parseInt(params.cctvId)
    const contacts = await telegramService.getCctvContacts(cctvId)
    
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST - Add Telegram contact to CCTV
 * Body: { chatId, phoneNumber, name }
 */
export async function POST(request, { params }) {
  try {
    const cctvId = parseInt(params.cctvId)
    const body = await request.json()
    const { chatId, phoneNumber, name } = body
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }
    
    const contact = await telegramService.addCctvContact(
      cctvId,
      chatId,
      phoneNumber,
      name
    )
    
    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remove Telegram contact from CCTV
 * Body: { contactId }
 */
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { contactId } = body
    
    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }
    
    await telegramService.removeCctvContact(contactId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
