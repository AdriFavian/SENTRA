import connectDB from '@/utils/connectDB'
import Accidents from '@/models/AccidentModel'
import { NextResponse } from 'next/server'
import { io } from 'socket.io-client'
import Cctv from '@/models/CctvModel'
import whatsappService from '@/services/whatsappService'
import telegramService from '@/services/telegramService'

//  @route  GET api/accidents
//  @desc   Get all accidents
//  @access Public
export async function GET() {
  try {
    await connectDB()
    const response = await Accidents.findAll()
    return NextResponse.json(response, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

//  @route  POST api/accidents
//  @desc   Create a post request on accident report
//  @access Public
export async function POST(request) {
  try {
    await connectDB()
    const { photos, ipAddress, severity, description, confidence } = await request.json()

    const ccCamera = await Cctv.findOne({ ipAddress })

    if (!ccCamera) {
      return NextResponse.json({ error: 'CCTV not found' }, { status: 404 })
    }

    // Ensure severity is never null or empty - set default if not provided
    const accidentSeverity = severity || 'Normal'

    // Validate severity is one of the allowed values
    const allowedSeverities = ['Fatal', 'Serious', 'Normal']
    const finalSeverity = allowedSeverities.includes(accidentSeverity) ? accidentSeverity : 'Normal'

    const createdAccident = await Accidents.create({
      photos,
      cctv: ccCamera,
      accidentClassification: finalSeverity,
      description: description || 'Accident detected automatically',
      confidence: confidence || 0.8
    })

    //initializing socket.io
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    socket.emit('send-message', createdAccident)

    console.log(`✅ Accident created with severity: ${finalSeverity}`)
    
    // Send WhatsApp notifications asynchronously (don't wait for completion)
    whatsappService.sendAccidentNotification(createdAccident, ccCamera)
      .then(results => {
        console.log(`📱 WhatsApp notifications sent: ${results.filter(r => r.success).length}/${results.length}`)
      })
      .catch(err => {
        console.error('❌ Error sending WhatsApp notifications:', err)
      })

    // Send Telegram notifications asynchronously (don't wait for completion)
    telegramService.sendAccidentNotification(createdAccident, ccCamera)
      .then(results => {
        console.log(`📱 Telegram notifications sent: ${results.filter(r => r.success).length}/${results.length}`)
      })
      .catch(err => {
        console.error('❌ Error sending Telegram notifications:', err)
      })

    return NextResponse.json(createdAccident, { status: 201 })
  } catch (e) {
    console.log(e.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
