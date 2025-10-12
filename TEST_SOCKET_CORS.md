# 🧪 Testing Socket.IO CORS Fix

## Quick Test Steps

### 1️⃣ Restart Services with Fix Applied

```powershell
.\restart-socket-fixed.bat
```

This will:
- ✅ Stop old ngrok and Socket.IO
- ✅ Start ngrok with CORS response headers
- ✅ Start Socket.IO with HTTP-level CORS handling
- ✅ Display the ngrok URL

### 2️⃣ Verify Local Services

**Check ngrok is running:**
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
      "config": {
        "addr": "http://localhost:4001"
      }
    }
  ]
}
```

**Check Socket.IO server:**
```powershell
curl http://localhost:4001
```

Expected: Some response (not error)

**Socket.IO server terminal should show:**
```
🚀 SENTRA Socket.IO Server
📡 Port: 4001
🌐 CORS: Allowed origins -> https://sentra-navy.vercel.app, ...
🔧 Transports: polling, websocket (ngrok-compatible)
✅ Server Status: Ready
🎧 HTTP Server listening on port 4001
🔄 Ready for Socket.IO connections...
```

### 3️⃣ Test ngrok Tunnel Directly

**Test OPTIONS preflight (the key test!):**
```powershell
curl -X OPTIONS `
  -H "Origin: https://sentra-navy.vercel.app" `
  -H "Access-Control-Request-Method: POST" `
  -H "Access-Control-Request-Headers: content-type" `
  -v https://YOUR_NGROK_URL.ngrok-free.app/socket.io/
```

**What to look for:**
```
< HTTP/2 200
< access-control-allow-origin: https://sentra-navy.vercel.app
< access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
< access-control-allow-credentials: true
```

✅ **If you see these headers, CORS is working!**

❌ **If you DON'T see these headers, ngrok config is wrong**

### 4️⃣ Update Vercel Environment Variable

**Option A: Automated (Recommended)**
```powershell
node update-vercel-env.mjs
```

**Option B: Manual**
1. Get ngrok URL: `curl http://localhost:4040/api/tunnels`
2. Copy the Socket.IO tunnel URL (e.g., `https://xxxx.ngrok-free.app`)
3. Go to: https://vercel.com/dashboard
4. Your project → Settings → Environment Variables
5. Find `NEXT_PUBLIC_SOCKET_URL`
6. Update value to ngrok URL
7. Save

**Important:** After updating env vars, Vercel will auto-redeploy

### 5️⃣ Test on Vercel Production

**Open in browser:**
```
https://sentra-navy.vercel.app
```

**Open DevTools Console (F12)**

**What you SHOULD see:**
```
Connecting to Socket.IO at: https://xxxx.ngrok-free.app
✅ Connected to Socket.IO server
👋 Welcome message: Connected to SENTRA Socket.IO server
```

**What you should NOT see:**
```
❌ Access to XMLHttpRequest has been blocked by CORS policy
❌ GET https://xxxx.ngrok-free.app/socket.io/... net::ERR_FAILED
❌ Socket.IO connection error: TransportError: xhr poll error
```

**Check Network Tab (F12 → Network):**
1. Filter by "socket.io"
2. Look for OPTIONS request (preflight)
3. Click on it → Headers tab
4. Response Headers should include:
   - `access-control-allow-origin: https://sentra-navy.vercel.app`
   - `access-control-allow-credentials: true`

### 6️⃣ Test Real-time Connection

**In Socket.IO server terminal, you should see:**
```
👤 Client connected: [socket-id]
📊 Total connected clients: 1
```

**In browser console, check transport:**
```javascript
// The socket object should show:
// transport: "websocket" (upgraded from polling)
// OR
// transport: "polling" (if websocket upgrade failed, but still works)
```

### 7️⃣ Test Accident Alert (End-to-End Test)

If you have Flask AI backend running, trigger an accident detection:

**Flask should send alert → Socket.IO should broadcast → Browser should receive**

**Browser console should show:**
```
🚨 Received accident message: { ... }
```

**Socket.IO server should show:**
```
🚨 ACCIDENT ALERT RECEIVED
📍 Location: ...
⚠️ Severity: ...
📢 Broadcasting to 1 other clients...
```

---

## 🔍 Debugging Tips

### CORS Still Failing?

**1. Check ngrok response headers:**
```powershell
curl -I -H "Origin: https://sentra-navy.vercel.app" https://YOUR_NGROK_URL/socket.io/
```

Should return:
```
access-control-allow-origin: https://sentra-navy.vercel.app
```

**2. Check Socket.IO server logs:**

If you see:
```
⚠️ Origin blocked: https://sentra-navy.vercel.app
```

Then the origin validation in `socket.js` is blocking it. Check the `allowedOrigins` array.

**3. Restart ngrok:**

ngrok free tier might cache old configurations. Fully restart:
```powershell
taskkill /F /IM ngrok.exe
timeout /t 3
ngrok start socket --config ngrok.yml
```

**4. Check Vercel env var is correct:**
```powershell
# Should output the ngrok URL
curl https://sentra-navy.vercel.app/api/test-env
```

Or check in browser console:
```javascript
console.log(process.env.NEXT_PUBLIC_SOCKET_URL)
```

### Connection Drops Frequently?

This is **NORMAL** with ngrok free tier. The client should auto-reconnect:

**Browser console:**
```
❌ Disconnected from Socket.IO server
Reconnecting in 1000ms...
✅ Connected to Socket.IO server
```

Reduce reconnection attempts if it's too aggressive:
```javascript
reconnectionAttempts: 3, // Instead of 10
reconnectionDelay: 2000, // Instead of 1000
```

### Stuck in Polling, Not Upgrading to WebSocket?

**Check browser console:**
```
transport: polling
```

**Possible causes:**
1. Firewall blocking WebSocket
2. ngrok free tier limitations
3. Vercel edge network restrictions

**Solution:** Polling still works! Just slower. To force WebSocket:
```javascript
transports: ['websocket'], // Remove 'polling'
```

But this might cause connection failures. Polling is more reliable with ngrok.

---

## ✅ Success Checklist

- [ ] ngrok running and tunnel established
- [ ] Socket.IO server running on port 4001
- [ ] OPTIONS preflight request returns CORS headers
- [ ] Vercel env var `NEXT_PUBLIC_SOCKET_URL` updated
- [ ] Browser console shows "✅ Connected to Socket.IO server"
- [ ] No CORS errors in browser console
- [ ] Socket.IO server logs show "👤 Client connected"
- [ ] Transport upgrades to websocket (or stays polling, both OK)
- [ ] Accident alerts are received in real-time

---

## 📊 Expected Behavior

### Initial Connection Flow:

1. **Browser:** Send OPTIONS preflight to `https://xxxx.ngrok-free.app/socket.io/`
2. **ngrok:** Add CORS response headers, forward to localhost:4001
3. **HTTP Server:** Respond 200 OK with CORS headers
4. **Browser:** OPTIONS passed! Now send GET for polling
5. **Socket.IO:** Accept connection, return session ID
6. **Browser:** Connected! Now try to upgrade to WebSocket
7. **Socket.IO:** Upgrade successful (or stay on polling if failed)

### What You'll See:

**Browser DevTools Network Tab:**
```
OPTIONS /socket.io/?EIO=4&transport=polling     200 OK
GET     /socket.io/?EIO=4&transport=polling     200 OK
GET     /socket.io/?EIO=4&transport=websocket   101 Switching Protocols
```

**Socket.IO Server Terminal:**
```
👤 Client connected: abc123
📊 Total connected clients: 1
```

---

## 🆘 Still Not Working?

1. **Clear browser cache:** `Ctrl+Shift+Delete`
2. **Hard reload:** `Ctrl+F5`
3. **Try incognito mode** to rule out extensions
4. **Check Vercel deployment logs** for errors
5. **Restart ALL services:**
   ```powershell
   .\restart-socket-fixed.bat
   ```
6. **Wait 2 minutes** for Vercel auto-redeploy after env var change

If still failing, share:
- Browser console errors (screenshot)
- Socket.IO server logs
- ngrok tunnel info: `curl http://localhost:4040/api/tunnels`
- Vercel env var screenshot (hide sensitive values)

---

**Last Updated:** October 13, 2025  
**Fix Applied:** HTTP-level CORS + ngrok response headers
