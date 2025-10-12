# 🚀 SENTRA Deployment Guide - Hybrid Architecture

## 📋 Arsitektur Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                    🌍 INTERNET                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌───────────────┐                   ┌──────────────────┐
│  ☁️ VERCEL     │                   │  💻 LAPTOP ANDA   │
│               │                   │                  │
│  Next.js      │ ◄─────ngrok──────►│  Flask (5000)    │
│  Frontend     │                   │  Socket (4001)   │
│               │                   │  Telegram Bot    │
└───────────────┘                   └──────────────────┘
        │                                     │
        │                                     │
        ▼                                     ▼
┌───────────────┐                   ┌──────────────────┐
│  Database     │                   │  AI Processing   │
│  PostgreSQL   │                   │  YOLOv8 Model    │
└───────────────┘                   └──────────────────┘
```

## 🎯 Kenapa Hybrid?

1. **Frontend di Vercel** → Cepat, reliable, global CDN
2. **Backend di Laptop** → AI processing berat (YOLOv8), real-time CCTV stream
3. **ngrok** → Expose localhost ke internet dengan HTTPS

---

## 📦 Prerequisites

### 1. Install Required Software

```powershell
# Install ngrok
winget install ngrok

# Atau download manual: https://ngrok.com/download

# Install Vercel CLI (jika belum)
npm i -g vercel
```

### 2. Setup ngrok Account

1. Buat akun di https://ngrok.com
2. Copy authtoken dari dashboard
3. Jalankan: `ngrok config add-authtoken YOUR_TOKEN`

---

## 🔧 Setup Step-by-Step

### STEP 1: Setup Database Production

Anda sudah punya DATABASE_URL di `.env`:
```
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/..."
```

✅ Database sudah siap!

### STEP 2: Setup Vercel Environment Variables

Login ke https://vercel.com/dashboard → Project SENTRA → Settings → Environment Variables

Tambahkan variabel berikut:

```env
# Database
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=...

# Backend URLs (akan diupdate dengan ngrok)
FLASK_AI_URL=https://YOUR-FLASK-NGROK.ngrok-free.app
NEXT_PUBLIC_FLASK_URL=https://YOUR-FLASK-NGROK.ngrok-free.app
NEXT_PUBLIC_SOCKET_URL=https://YOUR-SOCKET-NGROK.ngrok-free.app

# WhatsApp
FONNTE_TOKEN=UEKGM5BfP2L1DMb8zaR5

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Public URL untuk notifikasi
NGROK_URL=https://YOUR-FLASK-NGROK.ngrok-free.app

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**⚠️ PENTING:** URL ngrok akan berubah setiap restart (free tier). Untuk URL tetap, upgrade ke ngrok paid plan.

### STEP 3: Setup ngrok Configuration

File `ngrok.yml` sudah ada, pastikan isinya seperti ini:

```yaml
version: "2"
authtoken: YOUR_NGROK_AUTHTOKEN
tunnels:
  flask:
    proto: http
    addr: 5000
  socket:
    proto: http
    addr: 4001
```

### STEP 4: Update .env.local untuk Local Development

File `.env.local` untuk testing di localhost:

```env
# Database
DATABASE_URL=postgres://...your-db-url...

# Backend API (localhost untuk testing)
BACKEND_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001

# Flask AI Backend
FLASK_AI_URL=http://localhost:5000
NEXT_PUBLIC_FLASK_URL=http://localhost:5000

# WhatsApp
FONNTE_TOKEN=UEKGM5BfP2L1DMb8zaR5

# Telegram
TELEGRAM_BOT_TOKEN=7679014881:AAF-omBg9MxAKKRHb79_KcSO9liqZ8FNwQ4

# Public URL (akan diisi saat ngrok jalan)
NGROK_URL=https://xxxx.ngrok-free.app

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDKy5gJT7C1SZSJ2yEIQV54JWVLK9NYmT0

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## 🚀 Cara Menjalankan (Daily Use)

### Opsi A: Menggunakan Script Otomatis (RECOMMENDED)

Saya sudah buatkan script `start-production.bat` yang akan:
1. Start ngrok tunnels
2. Start Socket.IO server
3. Start Telegram Bot
4. Start Flask AI backend
5. Tampilkan ngrok URLs

**Jalankan:**
```powershell
.\start-production.bat
```

### Opsi B: Manual Step-by-Step

#### 1️⃣ Start ngrok tunnels:
```powershell
ngrok start --all --config ngrok.yml
```

Catat URLs yang muncul:
- Flask: `https://xxxx-xxx-xxx-xxx.ngrok-free.app` (port 5000)
- Socket: `https://yyyy-yyy-yyy-yyy.ngrok-free.app` (port 4001)

#### 2️⃣ Start Node.js Backend (Terminal baru):
```powershell
npm run backend
```

Atau manual:
```powershell
# Terminal 1: Socket.IO
node helpers/socket/socket.js

# Terminal 2: Telegram Bot
node telegram-bot.js
```

#### 3️⃣ Start Flask AI Backend (Terminal baru):
```powershell
python app.py
```

#### 4️⃣ Update Vercel Environment Variables:

**Cara Cepat - Menggunakan Script:**
```powershell
node update-vercel-env.js
```

**Cara Manual:**
1. Buka https://vercel.com/dashboard
2. Pilih project `sentra`
3. Settings → Environment Variables
4. Update variabel berikut dengan ngrok URLs:
   - `FLASK_AI_URL` → `https://xxxx.ngrok-free.app`
   - `NEXT_PUBLIC_FLASK_URL` → `https://xxxx.ngrok-free.app`
   - `NEXT_PUBLIC_SOCKET_URL` → `https://yyyy.ngrok-free.app`
   - `NGROK_URL` → `https://xxxx.ngrok-free.app`

#### 5️⃣ Redeploy Vercel (agar environment variables baru aktif):
```powershell
vercel --prod
```

---

## ✅ Testing Deployment

### 1. Test Frontend
Buka: https://sentra-navy.vercel.app

### 2. Test Socket.IO Connection
Cek di browser console, seharusnya muncul:
```
Connected to SENTRA Socket.IO server
```

### 3. Test Flask Backend
```powershell
curl https://YOUR-FLASK-NGROK.ngrok-free.app/health
```

### 4. Test Accident Detection
1. Tambah CCTV di https://sentra-navy.vercel.app/cctvs
2. CCTV akan otomatis mulai streaming
3. Jika ada kecelakaan terdeteksi:
   - Alert muncul di frontend
   - Notifikasi Telegram terkirim
   - Notifikasi WhatsApp terkirim

---

## 🔄 Update ngrok URLs (Setiap Restart)

### Masalah: ngrok free tier memberikan URL random setiap restart

### Solusi 1: Script Auto-Update (RECOMMENDED)
```powershell
# Jalankan setiap kali restart ngrok
node update-vercel-env.js
```

Script ini akan:
1. Ambil ngrok URLs otomatis
2. Update Vercel environment variables
3. Trigger redeploy

### Solusi 2: Upgrade ngrok ke Paid Plan
- URL tetap (tidak berubah)
- Custom domain
- Lebih stabil

---

## 📊 Monitoring

### Check Status Services:

```powershell
# Check ngrok tunnels
curl http://localhost:4040/api/tunnels

# Check Socket.IO
curl http://localhost:4001

# Check Flask
curl http://localhost:5000/health
```

### Logs:
- **Socket.IO:** Lihat terminal yang menjalankan `node helpers/socket/socket.js`
- **Telegram Bot:** Lihat terminal yang menjalankan `node telegram-bot.js`
- **Flask:** Lihat terminal yang menjalankan `python app.py`
- **Vercel:** https://vercel.com/dashboard → Deployments → View Logs

---

## 🛠️ Troubleshooting

### Problem: "Cannot connect to Socket.IO"
**Solution:**
1. Pastikan Socket.IO server jalan: `node helpers/socket/socket.js`
2. Pastikan ngrok tunnel aktif untuk port 4001
3. Update `NEXT_PUBLIC_SOCKET_URL` di Vercel dengan ngrok URL
4. Redeploy Vercel

### Problem: "AI Detection not working"
**Solution:**
1. Pastikan Flask server jalan: `python app.py`
2. Pastikan ngrok tunnel aktif untuk port 5000
3. Update `FLASK_AI_URL` dan `NEXT_PUBLIC_FLASK_URL` di Vercel
4. Redeploy Vercel

### Problem: "Telegram notification not sent"
**Solution:**
1. Pastikan Telegram Bot jalan: `node telegram-bot.js`
2. Check `TELEGRAM_BOT_TOKEN` di Vercel environment variables
3. Setup contact dulu di https://sentra-navy.vercel.app/cctvs/settings

### Problem: "ngrok URL berubah terus"
**Solution:**
1. Gunakan script auto-update: `node update-vercel-env.js`
2. Atau upgrade ke ngrok paid plan untuk static URL

---

## 💡 Tips Production

### 1. Jalankan Backend sebagai Windows Service

Install `node-windows`:
```powershell
npm install -g node-windows
```

Buat service (akan dijelaskan lebih detail jika perlu).

### 2. Auto-restart jika Crash

Gunakan PM2:
```powershell
npm install -g pm2

# Start dengan PM2
pm2 start helpers/socket/socket.js --name "sentra-socket"
pm2 start telegram-bot.js --name "sentra-telegram"
pm2 start app.py --name "sentra-flask" --interpreter python

# Save untuk auto-start
pm2 save
pm2 startup
```

### 3. ngrok Static URL

Upgrade ke ngrok paid plan ($8/month):
- Static subdomain: `sentra-flask.ngrok.io`
- Static socket: `sentra-socket.ngrok.io`
- Tidak perlu update Vercel setiap restart

---

## 📞 Quick Commands Reference

```powershell
# 1. Start semua backend
.\start-production.bat

# 2. Get ngrok URLs
.\get-ngrok-urls.bat

# 3. Update Vercel env vars
node update-vercel-env.js

# 4. Redeploy Vercel
vercel --prod

# 5. Check status
curl http://localhost:4040/api/tunnels
```

---

## 🎓 Summary

**Deployment Flow:**
1. Frontend → Vercel (always online)
2. Backend → Laptop Anda (jalan saat diperlukan)
3. Connection → ngrok tunnels (expose localhost)
4. Update ngrok URLs → Vercel env vars → Redeploy

**Daily Workflow:**
1. Nyalakan laptop
2. Jalankan `start-production.bat`
3. Jalankan `node update-vercel-env.js`
4. System siap digunakan!

**Shutdown:**
1. Stop ngrok (Ctrl+C)
2. Stop semua services (Ctrl+C di setiap terminal)
3. Frontend Vercel tetap online (tapi backend tidak berfungsi)

---

## 🔗 Useful Links

- **Frontend:** https://sentra-navy.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **ngrok Dashboard:** https://dashboard.ngrok.com
- **Database:** https://console.prisma.io

---

**🎉 Selamat! SENTRA Anda sudah deploy hybrid!**

Jika ada pertanyaan atau masalah, check troubleshooting di atas atau tanya lagi! 🚀
