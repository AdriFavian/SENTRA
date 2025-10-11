#!/usr/bin/env node

/**
 * Quick setup script for WhatsApp notification system
 * 
 * This script will:
 * 1. Verify environment configuration
 * 2. Create database tables
 * 3. Add sample contact for testing
 * 
 * Usage: node scripts/setup-whatsapp.js
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function setupWhatsApp() {
  console.log('🚀 Setting up WhatsApp Notification System\n')
  console.log('='.repeat(50))
  
  // Step 1: Check environment
  console.log('Step 1: Checking environment variables...')
  
  if (!process.env.FONNTE_TOKEN) {
    console.log('❌ FONNTE_TOKEN not found in .env.local')
    console.log('   Please add: FONNTE_TOKEN=UEKGM5BfP2L1DMb8zaR5')
    return
  }
  console.log('✅ FONNTE_TOKEN configured')
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found in .env.local')
    return
  }
  console.log('✅ DATABASE_URL configured')
  
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.log('⚠️  NEXT_PUBLIC_APP_URL not set, using default: http://localhost:3000')
  } else {
    console.log(`✅ NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL}`)
  }
  console.log()
  
  // Step 2: Connect to database
  console.log('Step 2: Connecting to PostgreSQL...')
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  
  try {
    const client = await pool.connect()
    console.log('✅ Connected to database')
    console.log()
    
    // Step 3: Create tables
    console.log('Step 3: Creating/verifying tables...')
    
    // WhatsApp contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_contacts (
        id SERIAL PRIMARY KEY,
        cctv_id INTEGER REFERENCES cctvs(id) ON DELETE CASCADE,
        phone_number VARCHAR(20) NOT NULL,
        name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(cctv_id, phone_number)
      )
    `)
    console.log('✅ whatsapp_contacts table ready')
    
    // WhatsApp notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_notifications (
        id SERIAL PRIMARY KEY,
        accident_id INTEGER REFERENCES accidents(id) ON DELETE CASCADE,
        phone_number VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'sent',
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ whatsapp_notifications table ready')
    
    // Update accidents table
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='accidents' AND column_name='handled_by'
        ) THEN
          ALTER TABLE accidents ADD COLUMN handled_by VARCHAR(20);
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='accidents' AND column_name='is_handled'
        ) THEN
          ALTER TABLE accidents ADD COLUMN is_handled BOOLEAN DEFAULT false;
        END IF;
      END $$;
    `)
    console.log('✅ accidents table updated')
    console.log()
    
    // Step 4: Check for CCTVs
    console.log('Step 4: Checking for existing CCTVs...')
    const cctvResult = await client.query('SELECT * FROM cctvs LIMIT 1')
    
    if (cctvResult.rows.length === 0) {
      console.log('⚠️  No CCTVs found. Please add a CCTV first.')
      console.log('   You can add one via the dashboard or API.')
    } else {
      const firstCctv = cctvResult.rows[0]
      console.log(`✅ Found CCTV: ${firstCctv.city} (ID: ${firstCctv.id})`)
      console.log()
      
      // Step 5: Offer to add test contact
      console.log('Step 5: Sample contact setup')
      console.log('   Would you like to add a test contact? (Skip for now)')
      console.log(`   You can add contacts via the dashboard UI or API`)
      console.log()
      console.log('   Example API call:')
      console.log(`   POST /api/whatsapp/cctv/${firstCctv.id}`)
      console.log('   {')
      console.log('     "phoneNumber": "087858520937",')
      console.log('     "name": "Emergency Response"')
      console.log('   }')
    }
    
    console.log()
    console.log('='.repeat(50))
    console.log('✅ WhatsApp Notification System Setup Complete!')
    console.log('='.repeat(50))
    console.log()
    console.log('Next steps:')
    console.log('1. Add WhatsApp contacts to your CCTVs via the dashboard')
    console.log('2. Test the system: node scripts/test-whatsapp.js')
    console.log('3. Trigger an accident detection to see notifications')
    console.log()
    console.log('📚 Documentation: WHATSAPP_NOTIFICATION_SYSTEM.md')
    console.log()
    
    client.release()
    await pool.end()
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    await pool.end()
    process.exit(1)
  }
}

// Run the setup
if (require.main === module) {
  setupWhatsApp()
}

module.exports = { setupWhatsApp }
