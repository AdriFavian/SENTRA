# 🔧 Fix Socket.IO CORS Error with ngrok

## 🚨 Problem
When using ngrok to tunnel Socket.IO connections from Vercel production, you get:
```
Access to XMLHttpRequest has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
GET https://xxxx.ngrok-free.app/socket.io/... net::ERR_FAILED 404
```

## 🎯 Root Cause
1. **ngrok free tier** requires special headers to bypass browser warning page
2. Socket.IO client was sending headers as **query parameters** instead of **HTTP headers**
3. ngrok blocks the request before it reaches your Socket.IO server
4. Socket.IO server wasn't configured to handle HTTP server properly

## ✅ Solution Applied

### 1. Updated Socket.IO Server (`helpers/socket/socket.js`)

**Changes:**
- ✅ Added HTTP server wrapper for better ngrok compatibility
- ✅ Enhanced CORS configuration with more permissive settings
- ✅ Added proper transports: `['polling', 'websocket']`
- ✅ Increased timeout settings for unreliable ngrok connections
- ✅ Better origin validation with ngrok and Vercel domains

**Key improvements:**
```javascript
import { createServer } from 'http'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true) // Allow no-origin requests
      
      const isAllowedNgrok = origin.endsWith('.ngrok-free.app')
      const isAllowedVercel = origin.endsWith('.vercel.app')
      
      if (isAllowedNgrok || isAllowedVercel || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      
      return callback(new Error(`Origin blocked: ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['ngrok-skip-browser-warning', 'Content-Type', 'Authorization'],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  pingTimeout: 60000,
  pingInterval: 25000
})

httpServer.listen(4001)
```

### 2. Updated ngrok Configuration (`ngrok.yml`)

**Changes:**
- ✅ Added `inspect: false` to disable ngrok inspection page
- ✅ Added request header transformation for Socket.IO tunnel

```yaml
tunnels:
  socket:
    proto: http
    addr: 4001
    inspect: false
    request_header:
      add:
        - "ngrok-skip-browser-warning: true"
```

### 3. Updated Client-Side Socket.IO Configuration

**Files updated:**
- `app/components/Popups.jsx`
- `app/components/RealtimeAlerts.jsx`
- `app/api/accidents/route.js`

**Changes:**
- ❌ **Before:** Using `query` parameters (doesn't work with ngrok)
  ```javascript
  const socket = io(url, {
    query: {
      'ngrok-skip-browser-warning': 'true'
    }
  })
  ```

- ✅ **After:** Using `extraHeaders` (works with ngrok)
  ```javascript
  const socket = io(url, {
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    extraHeaders: {
      'ngrok-skip-browser-warning': 'true'
    },
    withCredentials: true
  })
  ```

## 🚀 How to Apply the Fix

### Step 1: Restart ngrok with new configuration
```powershell
# Stop all ngrok processes
taskkill /F /IM ngrok.exe

# Start ngrok with updated config
ngrok start --all --config ngrok.yml
```

### Step 2: Restart Socket.IO server
```powershell
# Stop the current Socket.IO server (Ctrl+C)
# Then restart it
node helpers/socket/socket.js
```

### Step 3: Update Vercel environment variables
```powershell
# Get new ngrok URLs
curl http://localhost:4040/api/tunnels

# Update Vercel (automated script)
node update-vercel-env.mjs

# Or manually at: https://vercel.com/dashboard
# Settings → Environment Variables
# Update: NEXT_PUBLIC_SOCKET_URL with new ngrok URL
```

### Step 4: Redeploy frontend (if needed)
```powershell
# If environment variables were updated
vercel --prod
```

## 🧪 Testing the Fix

### 1. Check ngrok is running:
```powershell
curl http://localhost:4040/api/tunnels
```

Expected output:
```json
{
  "tunnels": [
    {
      "name": "socket",
      "public_url": "https://xxxx.ngrok-free.app",
      "proto": "https"
    }
  ]
}
```

### 2. Check Socket.IO server is running:
```powershell
curl http://localhost:4001
```

Expected: HTTP response (not error)

### 3. Test from browser console (on Vercel production):
```javascript
// Open https://sentra-navy.vercel.app
// Open DevTools Console

// Check environment variable
console.log(process.env.NEXT_PUBLIC_SOCKET_URL)

// Should show ngrok URL: https://xxxx.ngrok-free.app
```

### 4. Check browser console logs:
You should see:
```
Connecting to Socket.IO at: https://xxxx.ngrok-free.app
✅ Connected to Socket.IO server
👋 Welcome message: Connected to SENTRA Socket.IO server
```

You should **NOT** see:
```
❌ Access to XMLHttpRequest has been blocked by CORS policy
❌ GET https://xxxx.ngrok-free.app/socket.io/... net::ERR_FAILED 404
```

## 📋 Verification Checklist

- [ ] ngrok running with updated config (`ngrok start --all --config ngrok.yml`)
- [ ] Socket.IO server restarted (`node helpers/socket/socket.js`)
- [ ] Server shows: "🎧 HTTP Server listening on port 4001"
- [ ] Vercel env var `NEXT_PUBLIC_SOCKET_URL` updated with ngrok URL
- [ ] Browser console shows "✅ Connected to Socket.IO server"
- [ ] No CORS errors in browser console
- [ ] Socket.IO server logs show client connections
- [ ] Test accident detection triggers real-time alert

## 🔍 Troubleshooting

### Still getting CORS errors?

1. **Clear browser cache and hard reload:**
   - Chrome/Edge: `Ctrl+Shift+R`
   - Firefox: `Ctrl+F5`

2. **Verify ngrok URL is correct:**
   ```powershell
   curl http://localhost:4040/api/tunnels
   ```

3. **Check Vercel environment variable:**
   - Go to: https://vercel.com/dashboard
   - Your project → Settings → Environment Variables
   - `NEXT_PUBLIC_SOCKET_URL` should match ngrok URL

4. **Check Socket.IO server logs:**
   - Should show: "👤 Client connected: [socket-id]"
   - If you see "⚠️ Origin blocked:", add that origin to allowedOrigins

### Getting 404 errors?

1. **Verify Socket.IO server is running on port 4001:**
   ```powershell
   netstat -ano | findstr :4001
   ```

2. **Check ngrok is forwarding to correct port:**
   ```powershell
   curl http://localhost:4040/api/tunnels
   # Check "config.addr" is "localhost:4001"
   ```

### Connection drops frequently?

This is normal with ngrok free tier. The client will auto-reconnect:
```javascript
reconnection: true,
reconnectionDelay: 1000,
reconnectionAttempts: 10
```

### Need to test locally first?

Before testing on Vercel:
1. Set `NEXT_PUBLIC_SOCKET_URL=http://localhost:4001` in `.env.local`
2. Run `npm run dev`
3. Test Socket.IO connection locally
4. Once working, switch to ngrok URL for production

## 🎉 Success Indicators

When everything is working:

**Server logs:**
```
🚀 SENTRA Socket.IO Server
📡 Port: 4001
🎧 HTTP Server listening on port 4001
👤 Client connected: [socket-id]
📊 Total connected clients: 1
```

**Browser console:**
```
Connecting to Socket.IO at: https://xxxx.ngrok-free.app
✅ Connected to Socket.IO server
👋 Welcome message: Connected to SENTRA Socket.IO server
```

**Real-time functionality:**
- Accident detected → Server logs "🚨 ACCIDENT ALERT RECEIVED"
- Browser shows popup notification
- Alert appears in real-time alerts list
- Sound plays (if enabled)

---

## 📚 Additional Resources

- [Socket.IO CORS Documentation](https://socket.io/docs/v4/handling-cors/)
- [ngrok Configuration](https://ngrok.com/docs/secure-tunnels/ngrok-agent/reference/config/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

## 🆘 Need Help?

If issues persist:
1. Check all 3 components are running: ngrok, Socket.IO server, Vercel app
2. Review logs from all 3 sources
3. Verify environment variables match
4. Test with `curl` commands before browser testing
5. Use browser DevTools Network tab to inspect actual requests

---

**Last Updated:** October 13, 2025
**Applied to:** SENTRA v0.1.0
