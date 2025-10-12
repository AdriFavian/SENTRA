# 🔧 SENTRA - Troubleshooting Guide

## 🎯 Quick Diagnostics

Run this command to check all services:

```powershell
# Check ngrok
curl http://localhost:4040/api/tunnels

# Check Socket.IO
curl http://localhost:4001

# Check Flask
curl http://localhost:5000
```

---

## 🚨 Common Problems & Solutions

### 1. "Cannot connect to Socket.IO"

**Symptoms:**
- No real-time alerts
- Browser console error: "Socket.IO connection failed"

**Diagnosis:**
```powershell
# Check if Socket.IO is running
netstat -ano | findstr :4001

# Check ngrok tunnel
curl http://localhost:4040/api/tunnels
```

**Solutions:**

**A. Socket.IO not running**
```powershell
# Start Socket.IO
node helpers/socket/socket.js
```

**B. ngrok tunnel not active**
```powershell
# Start ngrok
ngrok start --all --config ngrok.yml
```

**C. Vercel env var wrong**
```powershell
# Update Vercel environment
node update-vercel-env.js

# Redeploy
vercel --prod
```

---

### 2. "AI Detection not working"

**Symptoms:**
- CCTV stream shows but no accident detection
- No alerts when accident happens

**Diagnosis:**
```powershell
# Check Flask
curl http://localhost:5000

# Check Flask logs
# (check terminal window running python app.py)
```

**Solutions:**

**A. Flask not running**
```powershell
# Start Flask
python app.py
```

**B. YOLOv8 model missing**
```powershell
# Check if model exists
dir test5.pt

# If missing, download/train the model
```

**C. CCTV IP unreachable**
- Check CCTV IP address is correct
- Try ping CCTV: `ping <cctv-ip>`
- Make sure laptop in same network as CCTV

**D. ngrok URL wrong in Vercel**
```powershell
# Update Vercel
node update-vercel-env.js
vercel --prod
```

---

### 3. "Telegram notifications not sent"

**Symptoms:**
- Accident detected but no Telegram message
- Telegram bot not responding

**Diagnosis:**
```powershell
# Check if bot is running
# (check terminal window running telegram-bot.js)

# Test bot manually
node scripts/test-telegram.js
```

**Solutions:**

**A. Bot not running**
```powershell
# Start Telegram Bot
node telegram-bot.js
```

**B. Bot token invalid**
- Check `TELEGRAM_BOT_TOKEN` in `.env.local`
- Check `TELEGRAM_BOT_TOKEN` in Vercel env vars
- Verify token at: https://t.me/BotFather

**C. No contacts configured**
1. Go to: https://sentra-navy.vercel.app/cctvs/settings
2. Add Telegram contacts for each CCTV
3. Get Chat ID: `node scripts/get-telegram-chatid.js`

**D. NGROK_URL not set**
- Check Vercel environment variable `NGROK_URL`
- Should be: `https://xxxx.ngrok-free.app`
- Update if wrong: `node update-vercel-env.js`

---

### 4. "WhatsApp notifications not sent"

**Symptoms:**
- No WhatsApp messages when accident detected

**Diagnosis:**
```powershell
# Test WhatsApp API
node scripts/test-whatsapp.js
```

**Solutions:**

**A. Fonnte token invalid**
- Check `FONNTE_TOKEN` in `.env.local`
- Check `FONNTE_TOKEN` in Vercel env vars
- Verify at: https://fonnte.com

**B. No contacts configured**
1. Go to: https://sentra-navy.vercel.app/cctvs
2. Click CCTV → Manage WhatsApp Contacts
3. Add phone numbers

**C. NGROK_URL not set**
- Same as Telegram issue D above

---

### 5. "ngrok URLs keep changing"

**Symptoms:**
- Need to update Vercel env vars every restart
- URLs like `https://xxxx.ngrok-free.app` different each time

**Why:**
- ngrok free tier gives random URLs

**Solutions:**

**A. Use auto-update script**
```powershell
# Every time ngrok restarts
node update-vercel-env.js
vercel --prod
```

**B. Upgrade ngrok to paid plan** (RECOMMENDED for production)
- Cost: $8/month
- Get static URLs (never change)
- Link: https://dashboard.ngrok.com/billing/plan
- Configure static subdomains:
  ```yaml
  tunnels:
    flask:
      subdomain: sentra-flask  # Will be sentra-flask.ngrok.io
      proto: http
      addr: 5000
    socket:
      subdomain: sentra-socket  # Will be sentra-socket.ngrok.io
      proto: http
      addr: 4001
  ```

---

### 6. "Database connection error"

**Symptoms:**
- Error: "Can't reach database server"
- Prisma errors in console

**Diagnosis:**
```powershell
# Test database connection
node -e "require('./utils/connectDB.js').default().then(() => console.log('✅ Connected')).catch(e => console.error('❌', e))"
```

**Solutions:**

**A. Wrong DATABASE_URL**
- Check `.env.local` has correct `DATABASE_URL`
- Check Vercel env vars has same `DATABASE_URL`
- Should start with: `prisma+postgres://` or `postgres://`

**B. Prisma client not generated**
```powershell
# Generate Prisma client
npx prisma generate
```

**C. Database not accessible**
- Check internet connection
- Verify database at: https://console.prisma.io
- Try creating new database if needed

---

### 7. "Frontend shows blank page"

**Symptoms:**
- https://sentra-navy.vercel.app shows white screen
- Browser console has errors

**Solutions:**

**A. Check Vercel deployment**
1. Go to: https://vercel.com/dashboard
2. Check latest deployment status
3. View logs for errors

**B. Redeploy**
```powershell
vercel --prod
```

**C. Check environment variables**
1. Vercel Dashboard → Settings → Environment Variables
2. Make sure all required vars are set (see VERCEL_ENV_CHECKLIST.md)

---

### 8. "Port already in use"

**Symptoms:**
- Error: "Port 4001 already in use"
- Error: "Port 5000 already in use"

**Solutions:**

**A. Kill existing process**
```powershell
# Find process using port
netstat -ano | findstr :4001
netstat -ano | findstr :5000

# Kill process (replace <PID> with actual PID)
taskkill /F /PID <PID>
```

**B. Use different ports** (not recommended)
- Update `ngrok.yml`
- Update service ports
- Update Vercel env vars

---

### 9. "npm/node/python not found"

**Symptoms:**
- Command not recognized errors

**Solutions:**

**A. Install Node.js**
- Download: https://nodejs.org
- Install LTS version

**B. Install Python**
- Download: https://python.org
- Version 3.8 or higher
- ✅ Check "Add to PATH"

**C. Restart terminal**
- Close and reopen terminal after installation

---

### 10. "Vercel CLI errors"

**Symptoms:**
- `vercel` command not found
- Login errors

**Solutions:**

**A. Install Vercel CLI**
```powershell
npm i -g vercel
```

**B. Login**
```powershell
vercel login
```

**C. Link project**
```powershell
vercel link
```

---

## 🧪 Testing Checklist

After fixing issues, test everything:

### ✅ Backend Services
```powershell
# 1. ngrok running
curl http://localhost:4040/api/tunnels
# Should show 2 tunnels (flask, socket)

# 2. Socket.IO running
curl http://localhost:4001
# Should return connection info

# 3. Flask running
curl http://localhost:5000
# Should return "OK" or similar
```

### ✅ Vercel Environment
1. Go to: https://vercel.com/dashboard
2. Project → Settings → Environment Variables
3. Verify all variables exist (use VERCEL_ENV_CHECKLIST.md)
4. Redeploy if changed

### ✅ Frontend Connection
1. Open: https://sentra-navy.vercel.app
2. Open browser console (F12)
3. Should see: "Connected to SENTRA Socket.IO server"

### ✅ Full Flow Test
1. Add a CCTV
2. Check CCTV streaming works
3. Simulate accident (or wait for real one)
4. Verify:
   - Alert popup shows ✅
   - Telegram notification sent ✅
   - WhatsApp notification sent ✅
   - Saved to database ✅

---

## 📊 Health Check Script

Save this as `health-check.bat`:

```batch
@echo off
echo ============================================
echo   SENTRA Health Check
echo ============================================
echo.

echo [1/5] Checking ngrok...
curl -s http://localhost:4040/api/tunnels >nul 2>&1
if %errorlevel%==0 (
    echo ✅ ngrok: RUNNING
) else (
    echo ❌ ngrok: NOT RUNNING
)

echo [2/5] Checking Socket.IO...
curl -s http://localhost:4001 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Socket.IO: RUNNING
) else (
    echo ❌ Socket.IO: NOT RUNNING
)

echo [3/5] Checking Flask...
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Flask: RUNNING
) else (
    echo ❌ Flask: NOT RUNNING
)

echo [4/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Node.js: INSTALLED
) else (
    echo ❌ Node.js: NOT INSTALLED
)

echo [5/5] Checking Python...
python --version >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Python: INSTALLED
) else (
    echo ❌ Python: NOT INSTALLED
)

echo.
echo ============================================
echo   Health Check Complete
echo ============================================
pause
```

---

## 🆘 Get Help

### Check Logs

**Socket.IO Logs:**
- Terminal running `node helpers/socket/socket.js`

**Flask Logs:**
- Terminal running `python app.py`

**Telegram Bot Logs:**
- Terminal running `node telegram-bot.js`

**Vercel Logs:**
- https://vercel.com/dashboard → Deployments → View Logs

**ngrok Logs:**
- http://localhost:4040 (ngrok web interface)

---

### Still Having Issues?

1. **Restart Everything:**
   ```powershell
   # Stop all services (Ctrl+C in each terminal)
   # Then run:
   .\start-all-backend.bat
   node update-vercel-env.js
   vercel --prod
   ```

2. **Check Documentation:**
   - `DEPLOYMENT_GUIDE.md` - Full deployment guide
   - `QUICK_START_DEPLOYMENT.md` - Quick start
   - `VERCEL_ENV_CHECKLIST.md` - Environment variables
   - `ARCHITECTURE_DIAGRAM.md` - System architecture

3. **Clean Start:**
   ```powershell
   # Stop all services
   # Delete node_modules
   rm -r node_modules
   
   # Reinstall
   npm install
   
   # Regenerate Prisma
   npx prisma generate
   
   # Start again
   .\start-all-backend.bat
   ```

---

**💡 Remember:**
- Keep all terminal windows open while SENTRA is running
- Check ngrok URLs haven't changed after restart
- Update Vercel env vars when ngrok URLs change
- Monitor logs for errors

**🎯 Most common fix:**
```powershell
node update-vercel-env.js
vercel --prod
```

This solves 80% of connection issues! 🚀
