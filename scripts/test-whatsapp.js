#!/usr/bin/env node

/**
 * Test script for WhatsApp notification system
 * 
 * This script helps you test the WhatsApp integration:
 * 1. Add test contacts to a CCTV
 * 2. Send test notification
 * 3. Test handling accident
 * 
 * Usage: node scripts/test-whatsapp.js
 */

require('dotenv').config({ path: '.env.local' })

const testWhatsApp = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const NGROK_URL = process.env.NGROK_URL
  
  console.log('🧪 Testing WhatsApp Notification System\n')
  console.log('='.repeat(50))
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Ngrok URL: ${NGROK_URL || '❌ Not configured'}`)
  console.log(`Fonnte Token: ${process.env.FONNTE_TOKEN ? '✅ Configured' : '❌ Not configured'}`)
  console.log('='.repeat(50))
  console.log()
  
  try {
    // Test 1: Check WhatsApp service
    console.log('Test 1: Checking WhatsApp service...')
    const serviceCheck = await fetch(`${BASE_URL}/api/whatsapp`)
    const serviceData = await serviceCheck.json()
    console.log('✅ Service status:', serviceData)
    console.log()
    
    // Test 2: Get all CCTVs
    console.log('Test 2: Getting CCTVs...')
    const cctvResponse = await fetch(`${BASE_URL}/api/cctvs`)
    const cctvs = await cctvResponse.json()
    
    if (cctvs.length === 0) {
      console.log('❌ No CCTVs found. Please add a CCTV first.')
      return
    }
    
    const testCctv = cctvs[0]
    console.log(`✅ Found CCTV: ${testCctv.city} (ID: ${testCctv._id})`)
    console.log()
    
    // Test 3: Add test contact
    console.log('Test 3: Adding test contact...')
    const testPhone = '087858520937'
    const addContactResponse = await fetch(`${BASE_URL}/api/whatsapp/cctv/${testCctv._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: testPhone,
        name: 'Test Contact'
      })
    })
    
    const contactData = await addContactResponse.json()
    if (contactData.success) {
      console.log('✅ Contact added:', contactData.contact)
    } else {
      console.log('ℹ️ Contact may already exist:', contactData.error)
    }
    console.log()
    
    // Test 4: Get contacts for CCTV
    console.log('Test 4: Getting contacts for CCTV...')
    const contactsResponse = await fetch(`${BASE_URL}/api/whatsapp/cctv/${testCctv._id}`)
    const contactsData = await contactsResponse.json()
    console.log(`✅ Contacts: ${contactsData.contacts.length}`)
    contactsData.contacts.forEach(c => {
      console.log(`   - ${c.name}: +${c.phoneNumber}`)
    })
    console.log()
    
    // Test 5: Send test message
    console.log('Test 5: Sending test WhatsApp message...')
    const testMessageResponse = await fetch(`${BASE_URL}/api/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: testPhone,
        message: `🧪 *TEST NOTIFIKASI SENTRA*\n\nIni adalah pesan test dari sistem deteksi kecelakaan SENTRA.\n\nWaktu: ${new Date().toLocaleString('id-ID')}\n\n✅ Sistem berfungsi dengan baik!`
      })
    })
    
    const messageData = await testMessageResponse.json()
    if (messageData.success) {
      console.log('✅ Test message sent successfully!')
      console.log('   Check WhatsApp:', `+${contactData.contact?.phoneNumber || testPhone}`)
    } else {
      console.log('❌ Failed to send test message:', messageData.data?.error || messageData.error)
    }
    console.log()
    
    // Test 6: Send test message with image (if ngrok is configured)
    if (NGROK_URL) {
      console.log('Test 6: Sending test message with image...')
      const testImageUrl = `${NGROK_URL}/res/emer.png`
      const imageMessageResponse = await fetch(`${BASE_URL}/api/whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: testPhone,
          message: `🧪 *TEST GAMBAR SENTRA*\n\nTesting image delivery via WhatsApp.\n\nImage URL: ${testImageUrl}`,
          imageUrl: testImageUrl
        })
      })
      
      const imageMessageData = await imageMessageResponse.json()
      if (imageMessageData.success) {
        console.log('✅ Test message with image sent successfully!')
      } else {
        console.log('❌ Failed to send image:', imageMessageData.data?.error || imageMessageData.error)
      }
      console.log()
    } else {
      console.log('⚠️ Skipping image test - NGROK_URL not configured')
      console.log()
    }
    
    console.log('='.repeat(50))
    console.log('✅ WhatsApp notification system test completed!')
    console.log('='.repeat(50))
    console.log()
    console.log('💡 Next steps:')
    console.log('1. Check your WhatsApp for the test message')
    console.log('2. Trigger an accident detection to test full workflow')
    console.log('3. Test "Handle" button response')
    console.log()
    
  } catch (error) {
    console.error('❌ Error during test:', error)
  }
}

// Run the test
if (require.main === module) {
  testWhatsApp()
}

module.exports = { testWhatsApp }
