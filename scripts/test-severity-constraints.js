#!/usr/bin/env node

/**
 * Test script to verify accident severity is properly set
 * 
 * This script tests that:
 * 1. Accidents are created with proper severity values
 * 2. Invalid severity values default to 'Normal'
 * 3. Missing severity values default to 'Normal'
 */

const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function testSeverityConstraints() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🧪 Testing severity constraints...')
    const client = await pool.connect()

    // Test 1: Try to insert with valid severity
    console.log('Test 1: Inserting with valid severity "Fatal"...')
    try {
      const result1 = await client.query(`
        INSERT INTO accidents (accident_classification, photos, cctv_id) 
        VALUES ('Fatal', 'test-photo-1.jpg', 1) 
        RETURNING *
      `)
      console.log('✅ Valid severity inserted successfully:', result1.rows[0].accident_classification)
    } catch (error) {
      console.log('❌ Test 1 failed:', error.message)
    }

    // Test 2: Try to insert with default (should use 'Normal')
    console.log('Test 2: Inserting without severity (should default to "Normal")...')
    try {
      const result2 = await client.query(`
        INSERT INTO accidents (photos, cctv_id) 
        VALUES ('test-photo-2.jpg', 1) 
        RETURNING *
      `)
      console.log('✅ Default severity applied:', result2.rows[0].accident_classification)
    } catch (error) {
      console.log('❌ Test 2 failed:', error.message)
    }

    // Test 3: Try to insert with invalid severity (should fail)
    console.log('Test 3: Trying to insert with invalid severity "Invalid" (should fail)...')
    try {
      const result3 = await client.query(`
        INSERT INTO accidents (accident_classification, photos, cctv_id) 
        VALUES ('Invalid', 'test-photo-3.jpg', 1) 
        RETURNING *
      `)
      console.log('❌ Test 3 should have failed but succeeded:', result3.rows[0])
    } catch (error) {
      console.log('✅ Invalid severity correctly rejected:', error.message.split('\n')[0])
    }

    // Test 4: Try to insert with NULL severity (should fail due to NOT NULL constraint)
    console.log('Test 4: Trying to insert with NULL severity (should fail)...')
    try {
      const result4 = await client.query(`
        INSERT INTO accidents (accident_classification, photos, cctv_id) 
        VALUES (NULL, 'test-photo-4.jpg', 1) 
        RETURNING *
      `)
      console.log('❌ Test 4 should have failed but succeeded:', result4.rows[0])
    } catch (error) {
      console.log('✅ NULL severity correctly rejected:', error.message.split('\n')[0])
    }

    // Clean up test data
    console.log('🧹 Cleaning up test data...')
    await client.query(`DELETE FROM accidents WHERE photos LIKE 'test-photo-%'`)

    client.release()
    console.log('🎉 All severity constraint tests completed!')

  } catch (error) {
    console.error('❌ Test error:', error.message)
  } finally {
    await pool.end()
  }
}

// Run the test
if (require.main === module) {
  testSeverityConstraints()
}

module.exports = { testSeverityConstraints }