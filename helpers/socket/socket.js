const io = require('socket.io')(4001, { 
  cors: { 
    origin: '*',
    methods: ["GET", "POST"]
  } 
})

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🚀 SENTRA Socket.IO Server')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📡 Port: 4001')
console.log('🌐 CORS: Enabled for all origins')
console.log('✅ Server Status: Ready')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('')

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

console.log('🔄 Listening for connections...')
console.log('Press Ctrl+C to stop')
console.log('')
