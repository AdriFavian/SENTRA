import { NextResponse } from 'next/server'
import whatsappService from '@/services/whatsappService'

/**
 * GET - Get all WhatsApp contacts for a CCTV
 * Params: cctvId
 */
export async function GET(request, { params }) {
  try {
    const { cctvId } = params
    const contacts = await whatsappService.getCctvContacts(cctvId)
    
    return NextResponse.json({
      success: true,
      contacts
    })
  } catch (error) {
    console.error('Error fetching CCTV contacts:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST - Add WhatsApp contact to CCTV
 * Params: cctvId
 * Body: { phoneNumber, name }
 */
export async function POST(request, { params }) {
  try {
    const { cctvId } = params
    const body = await request.json()
    const { phoneNumber, name } = body
    
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }
    
    const contact = await whatsappService.addCctvContact(
      cctvId,
      phoneNumber,
      name
    )
    
    return NextResponse.json({
      success: true,
      contact
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding CCTV contact:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remove WhatsApp contact from CCTV
 * Params: cctvId
 * Query: contactId
 */
export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')
    
    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }
    
    await whatsappService.removeCctvContact(contactId)
    
    return NextResponse.json({
      success: true,
      message: 'Contact removed successfully'
    })
  } catch (error) {
    console.error('Error removing CCTV contact:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
