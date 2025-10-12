#!/usr/bin/env node

/**
 * Auto-update Vercel Environment Variables with ngrok URLs
 * 
 * Prerequisites:
 * 1. Install Vercel CLI: npm i -g vercel
 * 2. Login to Vercel: vercel login
 * 3. Link project: vercel link
 * 
 * Usage: node update-vercel-env.js
 */

import { execSync } from 'child_process'
import http from 'http'

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🔄 SENTRA - Auto-update Vercel Environment')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('')

// Get ngrok tunnels
function getNgrokTunnels() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:4040/api/tunnels', (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data).tunnels
          resolve(tunnels)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

async function updateVercelEnv() {
  try {
    // Step 1: Get ngrok tunnels
    console.log('📡 Step 1: Fetching ngrok tunnel URLs...')
    const tunnels = await getNgrokTunnels()
    
    if (!tunnels || tunnels.length === 0) {
      console.error('❌ No ngrok tunnels found!')
      console.error('   Make sure ngrok is running: ngrok start --all --config ngrok.yml')
      process.exit(1)
    }
    
    console.log(`✅ Found ${tunnels.length} tunnel(s)\n`)
    
    // Find Flask and Socket tunnels by name
    const flaskTunnel = tunnels.find(t => t.name === 'flask' && t.proto === 'https')
    const socketTunnel = tunnels.find(t => t.name === 'socket' && t.proto === 'https')
    
    if (!flaskTunnel || !socketTunnel) {
      console.error('❌ Required tunnels not found!')
      console.error('   Expected: flask (port 5000) and socket (port 4001)')
      console.error('   Found tunnels:')
      tunnels.forEach(t => console.error(`     - ${t.name}: ${t.public_url}`))
      process.exit(1)
    }
    
    const flaskUrl = flaskTunnel.public_url.trim()
    const socketUrl = socketTunnel.public_url.trim()
    
    console.log('📋 Tunnel URLs:')
    console.log(`   Flask:  ${flaskUrl}`)
    console.log(`   Socket: ${socketUrl}`)
    console.log('')
    
    // Step 2: Update Vercel environment variables
    console.log('☁️  Step 2: Updating Vercel environment variables...')
    console.log('')
    
    const envVars = [
      { key: 'FLASK_AI_URL', value: flaskUrl },
      { key: 'NEXT_PUBLIC_FLASK_URL', value: flaskUrl },
      { key: 'NEXT_PUBLIC_SOCKET_URL', value: socketUrl },
      { key: 'NGROK_URL', value: flaskUrl }
    ]
    
    for (const envVar of envVars) {
      try {
        // Remove existing variable (ignore errors if doesn't exist)
        try {
          execSync(`vercel env rm ${envVar.key} production --yes`, { stdio: 'pipe' })
        } catch (e) {
          // Variable might not exist, that's ok
        }
        
        // Add new variable
        const cmd = process.platform === 'win32'
          ? `echo ${envVar.value} | vercel env add ${envVar.key} production`
          : `echo "${envVar.value}" | vercel env add ${envVar.key} production`
        
        execSync(cmd, { stdio: 'pipe' })
        console.log(`   ✅ ${envVar.key}`)
        console.log(`      ${envVar.value}`)
      } catch (error) {
        console.error(`   ❌ Failed to update ${envVar.key}`)
        console.error(`      ${error.message}`)
      }
    }
    
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ SUCCESS: Environment variables updated!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('� Next Steps:')
    console.log('   1. Redeploy Vercel to apply changes:')
    console.log('      vercel --prod')
    console.log('')
    console.log('   2. Or trigger redeploy from dashboard:')
    console.log('      https://vercel.com/dashboard')
    console.log('')
    console.log('   3. Access your app:')
    console.log('      https://sentra-navy.vercel.app')
    console.log('')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('')
    console.error('Troubleshooting:')
    console.error('   1. Make sure ngrok is running:')
    console.error('      ngrok start --all --config ngrok.yml')
    console.error('')
    console.error('   2. Check ngrok dashboard:')
    console.error('      http://localhost:4040')
    console.error('')
    console.error('   3. Make sure Vercel CLI is installed and logged in:')
    console.error('      npm i -g vercel')
    console.error('      vercel login')
    console.error('')
    console.error('   4. Make sure project is linked:')
    console.error('      vercel link')
    console.error('')
    process.exit(1)
  }
}

updateVercelEnv()
