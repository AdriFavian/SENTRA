#!/usr/bin/env node

/**
 * Migration script to update accident severity constraint
 * 
 * This script updates the accidents table to:
 * 1. Set default severity to 'Normal' for existing null/empty records
 * 2. Make accident_classification NOT NULL with default 'Normal'
 * 3. Update the check constraint to not allow empty strings
 * 
 * Usage: node scripts/update-severity-constraint.js
 */

const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function updateSeverityConstraint() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🔗 Connecting to PostgreSQL...')
    const client = await pool.connect()
    console.log('✅ Connected to PostgreSQL successfully')

    console.log('📊 Updating accident severity constraints...')

    // First, update any existing null or empty severity values to 'Normal'
    console.log('1. Updating existing null/empty severity records...')
    const updateResult = await client.query(`
      UPDATE accidents 
      SET accident_classification = 'Normal' 
      WHERE accident_classification IS NULL OR accident_classification = ''
    `)
    console.log(`✅ Updated ${updateResult.rowCount} records with default severity`)

    // Drop the existing check constraint if it exists
    console.log('2. Removing old check constraint...')
    await client.query(`
      ALTER TABLE accidents 
      DROP CONSTRAINT IF EXISTS accidents_accident_classification_check
    `)

    // Alter the column to NOT NULL with default value
    console.log('3. Setting NOT NULL constraint with default value...')
    await client.query(`
      ALTER TABLE accidents 
      ALTER COLUMN accident_classification SET DEFAULT 'Normal',
      ALTER COLUMN accident_classification SET NOT NULL
    `)

    // Add new check constraint that doesn't allow empty strings
    console.log('4. Adding new check constraint...')
    await client.query(`
      ALTER TABLE accidents 
      ADD CONSTRAINT accidents_accident_classification_check 
      CHECK (accident_classification IN ('Fatal', 'Serious', 'Normal'))
    `)

    // Verify the changes
    console.log('5. Verifying changes...')
    const verifyResult = await client.query(`
      SELECT column_name, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'accidents' AND column_name = 'accident_classification'
    `)
    
    console.log('Column info:', verifyResult.rows[0])

    const constraintResult = await client.query(`
      SELECT constraint_name, check_clause 
      FROM information_schema.check_constraints 
      WHERE constraint_name = 'accidents_accident_classification_check'
    `)
    
    console.log('Constraint info:', constraintResult.rows[0])

    client.release()
    console.log('🎉 Severity constraint update completed successfully!')
    console.log('')
    console.log('✅ Changes made:')
    console.log('  - accident_classification is now NOT NULL')
    console.log('  - Default value is "Normal"')
    console.log('  - Empty strings are no longer allowed')
    console.log('  - Only "Fatal", "Serious", "Normal" are valid values')

  } catch (error) {
    console.error('❌ Error updating severity constraint:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the update
if (require.main === module) {
  updateSeverityConstraint()
}

module.exports = { updateSeverityConstraint }