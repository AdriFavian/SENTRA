# 🔧 How to Get Your Telegram Chat ID

## ❌ Common Mistake

**WRONG:** Using phone number as Chat ID
```
6287866301810  ❌ This is a phone number, NOT a Chat ID
```

**CORRECT:** Using actual Telegram Chat ID
```
123456789  ✅ This is a real Chat ID (numeric user ID)
```

## ✅ How to Get Your Real Chat ID

### Method 1: Use @userinfobot (Easiest)

1. Open Telegram
2. Search for: **@userinfobot**
3. Send: `/start`
4. Bot will reply with your Chat ID

Example response:
```
Your ID: 1234567890
```

### Method 2: Use @RawDataBot

1. Search for: **@RawDataBot**
2. Send any message
3. Look for `"id":` in the JSON response

Example:
```json
{
  "from": {
    "id": 1234567890,  ← This is your Chat ID
    "first_name": "Your Name"
  }
}
```

### Method 3: Use Your SENTRA Bot

1. Make sure bot server is running:
```bash
npm run telegram
```

2. Open Telegram and search for: **@Sentra_message_bot**

3. Send: `/start`

4. Bot will reply with your Chat ID:
```
👋 Selamat datang di SENTRA Bot!
📝 Chat ID Anda: 1234567890
```

5. Or send: `/chatid`

## 🔄 Update Your Database

Once you have your REAL Chat ID:

### Option 1: Using API
```bash
curl -X POST http://localhost:3000/api/telegram/cctv/1 \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "YOUR_REAL_CHAT_ID",
    "phoneNumber": "087866301810",
    "name": "Your Name"
  }'
```

### Option 2: Using SQL
```sql
-- Delete old incorrect entry
DELETE FROM telegram_contacts WHERE chat_id = '6287866301810';

-- Insert with correct Chat ID
INSERT INTO telegram_contacts (cctv_id, chat_id, phone_number, name)
VALUES (1, 'YOUR_REAL_CHAT_ID', '087866301810', 'Your Name');
```

### Option 3: Update existing entry
```sql
UPDATE telegram_contacts 
SET chat_id = 'YOUR_REAL_CHAT_ID'
WHERE chat_id = '6287866301810';
```

## 📝 Complete Setup Steps

1. **Start the bot server:**
```bash
npm run telegram
```

2. **Get your Chat ID:**
   - Open Telegram
   - Search: @Sentra_message_bot
   - Send: /start
   - Copy the Chat ID from bot's response

3. **Update database with REAL Chat ID:**
```bash
# Replace YOUR_REAL_CHAT_ID with actual number from step 2
curl -X POST http://localhost:3000/api/telegram/cctv/1 \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "YOUR_REAL_CHAT_ID",
    "phoneNumber": "087866301810",
    "name": "Emergency Contact"
  }'
```

4. **Test notification:**
   - Trigger accident detection
   - You should receive message!

## 🎯 Example

Let's say @userinfobot tells you: `Your ID: 987654321`

Then update database:
```sql
UPDATE telegram_contacts 
SET chat_id = '987654321'
WHERE phone_number = '087866301810';
```

Now test:
```bash
curl -X POST http://localhost:3000/api/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "987654321",
    "message": "Test notification from SENTRA!"
  }'
```

## ⚠️ Important Notes

1. **Chat ID ≠ Phone Number**
   - Chat IDs are Telegram's internal user IDs
   - They're usually 9-10 digit numbers
   - They don't start with country code

2. **User Must Start Chat First**
   - User MUST send /start to bot before receiving messages
   - This is a Telegram security feature

3. **Chat ID is Permanent**
   - Once you get your Chat ID, it never changes
   - You can use it forever

## 🧪 Quick Test

After getting your real Chat ID:

```bash
# Start bot server
npm run telegram

# In another terminal, test message
curl -X POST http://localhost:3000/api/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "YOUR_REAL_CHAT_ID",
    "message": "🧪 Testing SENTRA notifications!"
  }'
```

You should receive the message in Telegram within 1-2 seconds!

## 📊 Verify Your Setup

Check database to see current entries:
```sql
SELECT * FROM telegram_contacts WHERE is_active = true;
```

Should show something like:
```
id | cctv_id | chat_id    | phone_number  | name
1  | 1       | 987654321  | 087866301810  | Your Name
```

---

**Need Help?**

1. ✅ Make sure bot server is running: `npm run telegram`
2. ✅ Start chat with @Sentra_message_bot
3. ✅ Send /start to get your Chat ID
4. ✅ Update database with REAL Chat ID
5. ✅ Test with curl command above

**Still not working?** Check:
- Bot server logs (Terminal 3)
- Next.js logs (Terminal 2)
- Verify TELEGRAM_BOT_TOKEN is correct
- Make sure you started chat with bot
