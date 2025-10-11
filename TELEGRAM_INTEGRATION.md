# Telegram Notification System - Documentation

## 🚀 Overview

The SENTRA Telegram notification system automatically sends accident alerts to multiple Telegram contacts when crashes or collisions (benturan/crash) are detected by the AI system. Each CCTV can have multiple recipients, and the system supports interactive buttons for handling accidents.

## 📋 Features

✅ **Multi-Recipient Support**: Each CCTV can have multiple Telegram contacts
✅ **Rich Notifications**: Sends accident photos, location, and details
✅ **Interactive Buttons**: "Tangani" (Handle) and "Tolak" (Reject) options
✅ **Auto-Response**: When one recipient handles an accident, others are notified
✅ **Indonesian Language**: All messages in Bahasa Indonesia
✅ **Database Integration**: All contacts and notifications logged to PostgreSQL

## 🏗️ Architecture

### Components

1. **Telegram Service** (`services/telegramService.js`)
   - Manages bot connection and message sending
   - Handles button callbacks
   - Manages contact database

2. **API Routes**
   - `/api/telegram` - Test and send messages
   - `/api/telegram/[id]` - Handle button callbacks
   - `/api/telegram/cctv/[cctvId]` - Manage CCTV contacts

3. **Database Tables**
   - `telegram_contacts` - Stores CCTV-to-Telegram mapping
   - `telegram_notifications` - Logs all sent notifications

4. **React Component**
   - `TelegramContactsManager.jsx` - UI for managing contacts

## 📊 Database Schema

### telegram_contacts
```sql
CREATE TABLE telegram_contacts (
  id SERIAL PRIMARY KEY,
  cctv_id INTEGER REFERENCES cctvs(id) ON DELETE CASCADE,
  chat_id VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cctv_id, chat_id)
);
```

### telegram_notifications
```sql
CREATE TABLE telegram_notifications (
  id SERIAL PRIMARY KEY,
  accident_id INTEGER REFERENCES accidents(id) ON DELETE CASCADE,
  chat_id VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Setup Instructions

### 1. Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the **Bot Token** (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Configure Environment

Add to your `.env.local`:
```env
TELEGRAM_BOT_TOKEN=7926849491:AAH7ipgI4GDTFnBqlAVANnu7jjztJo9ulRY
NGROK_URL=https://your-ngrok-url.ngrok-free.app
```

### 3. Install Dependencies

```bash
npm install node-telegram-bot-api
```

### 4. Run Database Migration

```bash
node scripts/migrate-to-postgres.js
```

Or setup Telegram tables specifically:
```bash
node scripts/setup-telegram.js
```

### 5. Test the Integration

```bash
node scripts/test-telegram.js
```

## 📱 Getting Chat IDs

Users need to provide their Telegram Chat ID to receive notifications:

### Method 1: Using @userinfobot
1. Open Telegram
2. Search for `@userinfobot`
3. Send `/start`
4. Bot will reply with your Chat ID

### Method 2: Using @RawDataBot
1. Search for `@RawDataBot`
2. Send any message
3. Look for `"id":` in the response

### Method 3: Start Chat with Your Bot
1. Search for your bot (e.g., `@SentraAlertBot`)
2. Send `/start`
3. The bot can be programmed to reply with the user's Chat ID

## 🔄 Workflow

### When Accident is Detected

1. **AI Detection**: YOLOv8 detects crash/benturan
2. **Accident Created**: Record saved to database
3. **Get Recipients**: System fetches all Telegram contacts for that CCTV
4. **Send Notifications**: Message sent to each contact with:
   - 🚨 Urgent alert header
   - 📸 Accident snapshot
   - 📍 Google Maps location link
   - ⚡ Severity classification
   - 🕐 Timestamp
   - ✅ "Tangani" button
   - ❌ "Tolak" button

### When User Presses "Tangani" (Handle)

1. **Update Database**: Marks accident as handled
2. **Acknowledge User**: Sends confirmation to handler
3. **Notify Others**: Sends update to all other recipients that accident is already being handled

### When User Presses "Tolak" (Reject)

1. **Acknowledge User**: Simple acknowledgment message
2. **No Other Action**: Other recipients still see the alert

## 💻 API Usage

### Test Telegram Service
```javascript
GET /api/telegram

Response:
{
  "status": "ok",
  "message": "Telegram service is running",
  "configured": true
}
```

### Send Test Message
```javascript
POST /api/telegram
{
  "chatId": "123456789",
  "message": "Test message",
  "imageUrl": "https://example.com/image.jpg" // optional
}
```

### Get CCTV Contacts
```javascript
GET /api/telegram/cctv/1

Response:
[
  {
    "id": 1,
    "chatId": "123456789",
    "phoneNumber": "087866301810",
    "name": "Emergency Contact",
    "cctvId": 1
  }
]
```

### Add Contact to CCTV
```javascript
POST /api/telegram/cctv/1
{
  "chatId": "123456789",
  "phoneNumber": "087866301810",
  "name": "Emergency Contact"
}
```

### Remove Contact
```javascript
DELETE /api/telegram/cctv/1
{
  "contactId": 1
}
```

## 📝 Message Format

### Accident Notification
```
🚨 *PERINGATAN KECELAKAAN LALU LINTAS* 🚨

*Lokasi:* Kota Malang
*Klasifikasi:* Fatal
*Waktu:* 11/10/2025 14:30:15

📍 *Lokasi GPS:*
https://www.google.com/maps?q=-7.9666,112.6326

⚠️ *SEGERA DIBUTUHKAN BANTUAN!*

Mohon segera konfirmasi apakah Anda akan menangani kecelakaan ini.

[✅ Tangani] [❌ Tolak]
```

### Handled Notification
```
✅ *KECELAKAAN SUDAH DITANGANI*

Kecelakaan yang terjadi pada:
*Waktu:* 11/10/2025 14:30:15

Sudah ditangani oleh petugas lain.

Terima kasih atas perhatian Anda.
```

## 🔐 Security Considerations

1. **Bot Token**: Keep your bot token secret. Never commit to git.
2. **Chat ID Validation**: Verify chat IDs before adding to database
3. **Rate Limiting**: Telegram has rate limits (30 messages/second)
4. **User Privacy**: Don't share chat IDs publicly
5. **Database Security**: Use parameterized queries (already implemented)

## 🐛 Troubleshooting

### Bot Not Responding
- Check if `TELEGRAM_BOT_TOKEN` is correct
- Ensure bot is not blocked by user
- Verify user has started a chat with the bot

### Messages Not Received
- Confirm user's Chat ID is correct
- Check if user has blocked the bot
- Verify bot has necessary permissions

### Database Errors
- Ensure tables are created (run migration)
- Check PostgreSQL connection
- Verify foreign key relationships

### Image Not Showing
- Check if `NGROK_URL` is configured correctly
- Ensure image URL is publicly accessible
- Verify image file exists in `public/snapshots/`

## 📊 Monitoring

### Check Notification Logs
```sql
SELECT 
  tn.*,
  a.accident_classification,
  a.created_at as accident_time
FROM telegram_notifications tn
JOIN accidents a ON a.id = tn.accident_id
ORDER BY tn.created_at DESC
LIMIT 10;
```

### Check Active Contacts
```sql
SELECT 
  tc.*,
  c.city,
  c.ip_address
FROM telegram_contacts tc
JOIN cctvs c ON c.id = tc.cctv_id
WHERE tc.is_active = true;
```

### Check Success Rate
```sql
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM telegram_notifications
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

## 🚀 Future Enhancements

- [ ] Add `/start` command to auto-register users
- [ ] Implement user management panel
- [ ] Add notification preferences per user
- [ ] Support for group chats
- [ ] Send periodic status updates
- [ ] Add accident statistics reports
- [ ] Implement notification scheduling
- [ ] Add multi-language support

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the test scripts output
3. Check application logs
4. Verify environment variables

## 📄 License

This is part of the SENTRA accident detection system.

---

**Important Notes:**
- Always test in development before deploying to production
- Keep your bot token secure
- Monitor notification costs and rate limits
- Ensure users consent to receiving notifications
- Comply with local data protection regulations
