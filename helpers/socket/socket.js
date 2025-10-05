const io = require('socket.io')(4001, { 
  cors: { 
    origin: '*',
    methods: ["GET", "POST"]
  } 
})

console.log('🚀 Socket.IO server starting on port 4001...')

io.on('connection', (socket) => {
  console.log('👤 Client connected:', socket.id)
  
  socket.on('send-message', (message) => {
    console.log('📢 Broadcasting accident message:', message._id || 'unknown')
    socket.broadcast.emit('receive-message', message)
    // Also emit to the sender for confirmation
    socket.emit('message-sent', { success: true, messageId: message._id })
  })
  
  socket.on('disconnect', () => {
    console.log('👋 Client disconnected:', socket.id)
  })
  
  // Send a welcome message when client connects
  socket.emit('welcome', { message: 'Connected to RoadSense Socket.IO server' })
})

console.log('✅ Socket.IO server ready and listening for connections on port 4001')
