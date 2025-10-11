# 🚀 Running SENTRA with Telegram Notifications

## ⚠️ IMPORTANT: Telegram Bot Polling Fix

The Telegram bot has been separated into a standalone server to avoid polling conflicts in Next.js.

## 🎯 Required Services

You need to run **4 services** simultaneously:

### 1. PostgreSQL Database
Make sure PostgreSQL is running on `localhost:5432`

### 2. Flask AI Server (YOLOv8)
```bash
# Terminal 1
python app.py
```
This runs on `http://localhost:5000`

### 3. Next.js Application
```bash
# Terminal 2
npm run dev
```
This runs on `http://localhost:3000`

### 4. Telegram Bot Server (NEW!)
```bash
# Terminal 3
npm run telegram
```
This handles button callbacks and polling

### 5. Socket.IO Server (Optional)
```bash
# Terminal 4
npm run socket
```
This runs on `http://localhost:4001`

## 📋 Complete Startup Guide

### Step 1: Ensure Database is Ready
```bash
# Test database connection
node scripts/migrate-to-postgres.js
```

### Step 2: Start All Services

**Terminal 1: Flask AI**
```bash
python app.py
```
Expected output:
```
✅ Socket connected to http://localhost:4001
Model loaded: test5.pt
* Running on http://localhost:5000
```

**Terminal 2: Next.js**
```bash
npm run dev
```
Expected output:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
✅ Telegram Bot initialized (webhook mode)
```

**Terminal 3: Telegram Bot** ⭐ **NEW - REQUIRED!**
```bash
npm run telegram
```
Expected output:
```
🤖 Telegram Bot Server Started
📡 Listening for button callbacks...
✅ Bot connected: @Sentra_message_bot
✨ Bot is ready to receive commands and callbacks!
```

**Terminal 4: Socket.IO (if needed)**
```bash
npm run socket
```

## 🎯 Why Separate Telegram Bot Server?

**Problem:** 
- Next.js hot-reloads modules during development
- Each reload creates a new Telegram bot instance
- Multiple instances cause polling conflicts: `409 Conflict`

**Solution:**
- Telegram bot runs in separate process
- No polling in Next.js service
- Next.js only sends messages (no polling)
- Standalone bot handles all callbacks

## 📱 Telegram Bot Commands

Once the bot server is running, users can:

### Get Chat ID
```
/start
```
Bot responds with:
```
👋 Selamat datang di SENTRA Bot!
📝 Chat ID Anda: 123456789
```

### Quick Chat ID
```
/chatid
```
Bot responds with your Chat ID

## 🔄 Message Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Accident Detected                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          Next.js sends notification via telegramService      │
│          (uses bot.sendPhoto - NO POLLING)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               User receives message with buttons             │
│               [✅ Tangani] [❌ Tolak]                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│        User presses button → Telegram sends callback         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│    Standalone Bot Server receives callback (WITH POLLING)    │
│    Updates database and notifies other users                 │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Testing

### Test 1: Check Services
```bash
# Check Next.js
curl http://localhost:3000/api/telegram

# Should return:
# {"status":"ok","message":"Telegram service is running","configured":true}
```

### Test 2: Send Test Message
```bash
curl -X POST http://localhost:3000/api/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "YOUR_CHAT_ID",
    "message": "Test from SENTRA"
  }'
```

### Test 3: Trigger Accident Detection
- Point CCTV to video with accident
- Flask AI will detect crash/benturan
- You should receive Telegram notification
- Press buttons to test callbacks

## ❌ Error: 409 Conflict

If you see:
```
error: [polling_error] ETELEGRAM: 409 Conflict: 
terminated by other getUpdates request
```

**Fix:**
1. Stop ALL running processes
2. Start services in order:
   - Terminal 1: `python app.py`
   - Terminal 2: `npm run dev`
   - Terminal 3: `npm run telegram` ⭐ **Wait for "Bot is ready"**
   - Terminal 4: `npm run socket` (if needed)

## 📊 Monitoring

### Check Bot Server Logs
Watch Terminal 3 for:
```
📥 Callback received: handle_123 from 987654321
✅ Accident 123 marked as handled
📤 Notified 111222333 that accident is handled
```

### Check Next.js Logs
Watch Terminal 2 for:
```
✅ Telegram Bot initialized (webhook mode)
📱 Telegram notifications sent: 3/3
```

### Check Database
```sql
-- Recent notifications
SELECT * FROM telegram_notifications 
ORDER BY created_at DESC LIMIT 10;

-- Handled accidents
SELECT * FROM accidents 
WHERE is_handled = true 
ORDER BY handled_at DESC;
```

## 🔧 Troubleshooting

### Bot Not Responding to Buttons
- Ensure `npm run telegram` is running
- Check Terminal 3 for callback logs
- Verify database connection

### Messages Not Sending
- Check Next.js is running (`npm run dev`)
- Verify TELEGRAM_BOT_TOKEN in .env.local
- Check user has started chat with bot

### Multiple 409 Errors
- Stop ALL Node.js processes
- Wait 30 seconds
- Start only ONE instance of `npm run telegram`

## 📝 Production Deployment

For production:

1. Use **webhooks** instead of polling
2. Configure webhook URL in telegramService.js
3. Use PM2 or systemd to manage bot process
4. Set up reverse proxy (nginx)
5. Use environment variables for all tokens

## 🎯 Summary

**Development Setup:**
- ✅ 3 terminals minimum (Flask, Next.js, Telegram Bot)
- ✅ Telegram bot runs separately
- ✅ No polling conflicts
- ✅ Full button callback support

**Key Points:**
- 🔴 Always start `npm run telegram` in separate terminal
- 🔴 Only ONE instance of Telegram bot should run
- 🔴 Next.js DOES NOT poll (webhook mode)
- 🟢 All button callbacks handled by standalone bot

---

**Quick Start:**
```bash
# Terminal 1
python app.py

# Terminal 2  
npm run dev

# Terminal 3 ⭐ IMPORTANT!
npm run telegram
```

Then test by triggering accident detection! 🚀
