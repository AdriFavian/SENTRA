import { Server } from 'socket.io'
import { createServer } from 'http'

const allowedOrigins = [
  'https://sentra-navy.vercel.app',
  'http://localhost:4001',
  'http://localhost:3000'
]

// Create HTTP server with manual CORS handling for ngrok compatibility
const httpServer = createServer((req, res) => {
  const origin = req.headers.origin
  
  // Check if origin is allowed
  const isAllowed = !origin || 
    allowedOrigins.includes(origin) || 
    origin.endsWith('.vercel.app') || 
    origin.endsWith('.ngrok-free.app')
  
  // Set CORS headers BEFORE Socket.IO processes the request
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400') // 24 hours
  }
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  // Let Socket.IO handle other requests
  // (Socket.IO will attach its handlers to this server)
})

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      
      const isAllowedOrigin = allowedOrigins.includes(origin)
      const isAllowedVercel = origin.endsWith('.vercel.app') && origin.includes('sentra')
      const isAllowedNgrok = origin.endsWith('.ngrok-free.app')

      if (isAllowedOrigin || isAllowedVercel || isAllowedNgrok) {
        return callback(null, true)
      }

      console.log(`⚠️  Origin blocked: ${origin}`)
      return callback(new Error(`Origin ${origin} not allowed by Socket.IO CORS config`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    credentials: true
  },
  // Transport settings for ngrok
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  // Enable upgrade from polling to websocket
  upgradeTimeout: 30000,
  // Add path for Socket.IO
  path: '/socket.io/',
  // Serve client (optional, for debugging)
  serveClient: false
})

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🚀 SENTRA Socket.IO Server')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📡 Port: 4001')
console.log('🌐 CORS: Allowed origins ->', [...allowedOrigins, '*.ngrok-free.app', 'sentra-navy*.vercel.app'].join(', '))
console.log('🔧 Transports: polling, websocket (ngrok-compatible)')
console.log('✅ Server Status: Ready')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('')

// Start HTTP server
httpServer.listen(4001, () => {
  console.log('🎧 HTTP Server listening on port 4001')
  console.log('🔄 Ready for Socket.IO connections...')
  console.log('Press Ctrl+C to stop')
  console.log('')
})

let connectedClients = 0
let totalMessages = 0

io.on('connection', (socket) => {
  connectedClients++
  console.log(`👤 Client connected: ${socket.id}`)
  console.log(`📊 Total connected clients: ${connectedClients}`)
  
  // Send welcome message with server stats
  socket.emit('welcome', { 
    message: 'Connected to SENTRA Socket.IO server',
    serverId: socket.id,
    timestamp: new Date().toISOString()
  })
  
  socket.on('send-message', (message) => {
    totalMessages++
    const severity = message.accidentClassification || 'Unknown'
    const location = message.cctv?.city || message.cctv?.ipAddress || 'Unknown'
    
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('� ACCIDENT ALERT RECEIVED')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📍 Location: ${location}`)
    console.log(`⚠️  Severity: ${severity}`)
    console.log(`🆔 Alert ID: ${message._id || 'N/A'}`)
    console.log(`📸 Photo: ${message.photos || 'N/A'}`)
    console.log(`🎯 Confidence: ${message.confidence ? (message.confidence * 100).toFixed(1) + '%' : 'N/A'}`)
    console.log(`⏰ Timestamp: ${new Date().toLocaleString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📢 Broadcasting to ${connectedClients - 1} other clients...`)
    console.log('')
    
    // Broadcast to all other clients
    socket.broadcast.emit('receive-message', message)
    
    // Send confirmation to sender
    socket.emit('message-sent', { 
      success: true, 
      messageId: message._id,
      totalMessages: totalMessages,
      timestamp: new Date().toISOString()
    })
  })
  
  socket.on('disconnect', () => {
    connectedClients--
    console.log(`👋 Client disconnected: ${socket.id}`)
    console.log(`📊 Total connected clients: ${connectedClients}`)
  })

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error)
  })
})

// Periodic status update
setInterval(() => {
  if (connectedClients > 0) {
    console.log(`💡 Status: ${connectedClients} clients connected, ${totalMessages} total messages processed`)
  }
}, 60000) // Every minute
