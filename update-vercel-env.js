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

const { execSync } = require('child_process')
const https = require('https')

console.log('🔄 Auto-updating Vercel Environment Variables...\n')

// Get ngrok tunnels
function getNgrokTunnels() {
  return new Promise((resolve, reject) => {
    https.get('http://localhost:4040/api/tunnels', (res) => {
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
    console.log('📡 Fetching ngrok tunnels...')
    const tunnels = await getNgrokTunnels()
    
    // Find Flask and Socket tunnels
    const flaskTunnel = tunnels.find(t => t.config.addr.includes('5000'))
    const socketTunnel = tunnels.find(t => t.config.addr.includes('4001'))
    
    if (!flaskTunnel || !socketTunnel) {
      console.error('❌ Error: Could not find ngrok tunnels')
      console.log('   Make sure ngrok is running: ngrok start --all --config ngrok.yml')
      process.exit(1)
    }
    
    const flaskUrl = flaskTunnel.public_url
    const socketUrl = socketTunnel.public_url
    
    console.log('\n📋 Found ngrok URLs:')
    console.log(`   Flask:  ${flaskUrl}`)
    console.log(`   Socket: ${socketUrl}`)
    console.log('\n🔧 Updating Vercel environment variables...\n')
    
    // Update Vercel environment variables
    const commands = [
      `vercel env rm NEXT_PUBLIC_FLASK_URL production -y`,
      `vercel env add NEXT_PUBLIC_FLASK_URL production`,
      `vercel env rm NEXT_PUBLIC_SOCKET_URL production -y`,
      `vercel env add NEXT_PUBLIC_SOCKET_URL production`,
      `vercel env rm NGROK_URL production -y`,
      `vercel env add NGROK_URL production`,
    ]
    
    try {
      // Remove old values
      console.log('🗑️  Removing old environment variables...')
      execSync(`echo "y" | vercel env rm NEXT_PUBLIC_FLASK_URL production`, { stdio: 'inherit' })
      execSync(`echo "y" | vercel env rm NEXT_PUBLIC_SOCKET_URL production`, { stdio: 'inherit' })
      execSync(`echo "y" | vercel env rm NGROK_URL production`, { stdio: 'inherit' })
      
      // Add new values
      console.log('\n➕ Adding new environment variables...')
      execSync(`echo "${flaskUrl}" | vercel env add NEXT_PUBLIC_FLASK_URL production`, { stdio: 'inherit' })
      execSync(`echo "${socketUrl}" | vercel env add NEXT_PUBLIC_SOCKET_URL production`, { stdio: 'inherit' })
      execSync(`echo "${flaskUrl}" | vercel env add NGROK_URL production`, { stdio: 'inherit' })
      
      console.log('\n✅ Environment variables updated successfully!')
      console.log('\n📝 Next steps:')
      console.log('   1. Redeploy your Vercel project')
      console.log('   2. Or run: vercel --prod')
      console.log('\n💡 Tip: Run this script every time ngrok restarts\n')
      
    } catch (error) {
      console.error('\n❌ Error updating Vercel environment variables')
      console.log('\n📝 Manual update required:')
      console.log(`   NEXT_PUBLIC_FLASK_URL=${flaskUrl}`)
      console.log(`   NEXT_PUBLIC_SOCKET_URL=${socketUrl}`)
      console.log(`   NGROK_URL=${flaskUrl}`)
      console.log('\n   Update at: https://vercel.com/dashboard')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n🔍 Troubleshooting:')
    console.log('   1. Is ngrok running? Check: http://localhost:4040')
    console.log('   2. Is Vercel CLI installed? Run: npm i -g vercel')
    console.log('   3. Are you logged in? Run: vercel login')
    console.log('   4. Is project linked? Run: vercel link')
  }
}

updateVercelEnv()
