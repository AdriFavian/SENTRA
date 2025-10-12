# ⚡ Quick Deploy Guide - SENTRA

## 🎯 Setup Pertama Kali (One-time Setup)

### 1. Deploy Frontend ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

Follow prompts:
- Link to existing project? **No**
- Project name: **sentra** (atau nama lain)
- Directory: **.**
- Override settings? **No**

### 2. Setup Database di Vercel

1. Buka Vercel Dashboard → Your Project
2. Storage → Create Database → Postgres
3. Copy `DATABASE_URL`
4. Settings → Environment Variables → Add:
   ```
   DATABASE_URL=your_postgres_url
   ```

### 3. Setup Environment Variables di Vercel

Go to: Settings → Environment Variables

Add semua variable ini:

```env
# Database
DATABASE_URL=<from Vercel Postgres>

# Backend (isi sementara, akan diupdate)
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
NGROK_URL=http://localhost:3000

# Telegram
TELEGRAM_BOT_TOKEN=<your_bot_token>
TELEGRAM_BOT_USERNAME=<your_bot_username>

# WhatsApp
FONNTE_TOKEN=UEKGM5BfP2L1DMb8zaR5

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your_api_key>

# App Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Redeploy

```bash
vercel --prod
```

### 5. Setup Database Tables

```bash
# Update .env.local dengan Vercel Postgres URL
# Lalu jalankan:
node scripts/migrate-to-postgres.js
```

---

## 🚀 Menjalankan Setiap Hari

### Opsi 1: Manual (Windows)

**Double-click**: `start-production.bat`

Kemudian:
1. Buka http://localhost:4040 (ngrok inspector)
2. Copy URLs ngrok
3. Update di Vercel → Settings → Environment Variables
4. Redeploy Vercel

### Opsi 2: Automated (Recommended)

```bash
# Terminal 1: Start services
start-production.bat

# Terminal 2: Auto-update Vercel (setelah ngrok running)
node update-vercel-env.js

# Redeploy Vercel
vercel --prod
```

---

## 📋 Checklist Sebelum Mulai

- [ ] Python installed
- [ ] Node.js installed
- [ ] ngrok account & authtoken
- [ ] Vercel account
- [ ] Telegram bot token
- [ ] Google Maps API key
- [ ] Internet connection stable

---

## 🔧 Troubleshooting

### ngrok: command not found
```bash
# Download dari https://ngrok.com/download
# Extract dan tambahkan ke PATH
```

### Vercel: Not logged in
```bash
vercel login
```

### Port already in use
```bash
# Kill process on port 4001
netstat -ano | findstr :4001
taskkill /PID <PID> /F

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database connection error
- Check DATABASE_URL correct
- Verify Vercel Postgres is active
- Check network connection

---

## 💡 Tips

### ngrok Free Plan Limitations:
- URL berubah setiap restart
- 40 connections/minute
- **Solution**: Upgrade ke ngrok Pro ($8/mo) untuk static domain

### Keep Laptop Running:
```powershell
# Disable sleep mode
powercfg -change -standby-timeout-ac 0
powercfg -change -hibernate-timeout-ac 0
```

### Auto-start on Boot:
1. Press Win+R → `shell:startup`
2. Create shortcut to `start-production.bat`
3. Laptop akan auto-start services saat boot

---

## 📊 Monitoring

- **Vercel Logs**: https://vercel.com/dashboard → Your Project → Deployments
- **ngrok Inspector**: http://localhost:4040
- **Socket.IO**: Check terminal logs
- **Flask**: Check terminal logs

---

## 🎉 Done!

Your app is now:
- ✅ Frontend on Vercel (Fast, Global CDN)
- ✅ Backend on your laptop (Your GPU power)
- ✅ Real-time notifications
- ✅ Production ready

**Access**: https://your-app.vercel.app
