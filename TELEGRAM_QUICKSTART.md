# 🚀 Quick Start - Telegram Integration

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run database migration:**
```bash
node scripts/migrate-to-postgres.js
```

## Setup

1. **Get your Telegram Chat ID:**
   - Open Telegram
   - Search for `@userinfobot`
   - Send `/start`
   - Copy your Chat ID (it will be a number like `123456789`)

2. **Configure the bot:**
   The bot is already configured with:
   - Token: `7926849491:AAH7ipgI4GDTFnBqlAVANnu7jjztJo9ulRY`
   - Test number: `087866301810`

3. **Start the application:**
```bash
npm run dev
```

## Testing

Run the test script:
```bash
node scripts/test-telegram.js
```

This will:
- ✅ Verify bot connection
- ✅ Add your test contact
- ✅ Send a test message to `087866301810`

## Important Steps

### 1. Start Chat with Bot
Before you can receive notifications, you MUST:
1. Find the bot in Telegram (get username from test script)
2. Send `/start` to the bot
3. The bot will respond and you're registered

### 2. Add Contact to CCTV

**Option A: Using the API**
```bash
curl -X POST http://localhost:3000/api/telegram/cctv/1 \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "YOUR_CHAT_ID",
    "phoneNumber": "087866301810",
    "name": "Your Name"
  }'
```

**Option B: Using the UI**
- Navigate to CCTV management page
- Use the Telegram Contacts Manager component
- Add your Chat ID

### 3. Trigger Test Accident

When the AI detects a crash/benturan, you'll automatically receive:
- 📸 Accident snapshot
- 📍 Google Maps location
- ⚡ Severity classification
- 🕐 Timestamp
- Two buttons: "✅ Tangani" and "❌ Tolak"

## Notification Flow

```
┌─────────────┐
│ AI Detects  │
│ Accident    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Create Accident │
│ in Database     │
└──────┬──────────┘
       │
       ▼
┌──────────────────┐
│ Get Telegram     │
│ Contacts for     │
│ CCTV             │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ Send Notification    │
│ to All Contacts      │
│ (Photo + Buttons)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ User Presses         │
│ "Tangani" Button     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Mark as Handled      │
│ Notify Others        │
└──────────────────────┘
```

## Example Notification

```
🚨 PERINGATAN KECELAKAAN LALU LINTAS 🚨

Lokasi: Kota Malang
Klasifikasi: Fatal
Waktu: 11/10/2025 14:30:15

📍 Lokasi GPS:
https://www.google.com/maps?q=-7.9666,112.6326

⚠️ SEGERA DIBUTUHKAN BANTUAN!

Mohon segera konfirmasi apakah Anda akan menangani kecelakaan ini.

[✅ Tangani] [❌ Tolak]
```

## Troubleshooting

### "Bot not responding"
- Make sure you started a chat with the bot first
- Send `/start` to the bot in Telegram

### "Failed to send message"
- Check if your Chat ID is correct
- Ensure the bot is not blocked
- Verify TELEGRAM_BOT_TOKEN is set

### "No notifications received"
- Confirm contact is added to the CCTV
- Check database: `SELECT * FROM telegram_contacts WHERE is_active = true;`
- Check logs in the terminal

## Database Queries

### Check your contacts
```sql
SELECT * FROM telegram_contacts WHERE phone_number = '087866301810';
```

### Check sent notifications
```sql
SELECT 
  tn.*,
  a.accident_classification,
  a.created_at
FROM telegram_notifications tn
JOIN accidents a ON a.id = tn.accident_id
ORDER BY tn.created_at DESC
LIMIT 10;
```

### Check accidents
```sql
SELECT 
  a.*,
  c.city,
  c.ip_address
FROM accidents a
JOIN cctvs c ON c.id = a.cctv_id
ORDER BY a.created_at DESC
LIMIT 5;
```

## Next Steps

1. ✅ Complete the migration
2. ✅ Test the bot connection
3. ✅ Add your contacts
4. ✅ Start the Flask AI service (`python app.py`)
5. ✅ Start Next.js app (`npm run dev`)
6. ✅ Trigger accident detection
7. ✅ Receive notifications!

## Support

- Full documentation: `TELEGRAM_INTEGRATION.md`
- Test script: `node scripts/test-telegram.js`
- Setup script: `node scripts/setup-telegram.js`

---

**Your Test Configuration:**
- Telegram Bot Token: `7926849491:AAH7ipgI4GDTFnBqlAVANnu7jjztJo9ulRY`
- Test Phone: `087866301810`
- Sample Chat ID: `6287866301810` (update with your actual Chat ID)
