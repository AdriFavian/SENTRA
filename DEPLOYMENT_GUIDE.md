# 🚀 PANDUAN DEPLOYMENT SENTRA
## Frontend (Vercel) + Backend (Laptop Anda)

---

## 📋 Ringkasan Arsitektur

- **Frontend (Vercel)**: Next.js, API Routes, PostgreSQL Database
- **Backend (Laptop)**: Flask (YOLO AI), Socket.IO, Telegram Bot, ngrok

---

## 🎯 BAGIAN 1: Persiapan Laptop (Backend)

### 1.1 Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies (jika belum)
npm install
```

### 1.2 Install ngrok

1. Download ngrok: https://ngrok.com/download
2. Sign up gratis di ngrok.com untuk mendapat authtoken
3. Setup authtoken:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

### 1.3 Update ngrok.yml

Buat/update file `ngrok.yml` di root project:

```yaml
version: "2"
authtoken: YOUR_NGROK_AUTH_TOKEN

tunnels:
  flask:
    addr: 5000
    proto: http
  socket:
    addr: 4001
    proto: http
```

---

## 🌐 BAGIAN 2: Deploy Frontend ke Vercel

### 2.1 Persiapan Repository

```bash
# Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2.2 Deploy ke Vercel

1. **Buka Vercel Dashboard**: https://vercel.com
2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import repository GitHub Anda (SENTRA)
   - Framework Preset: **Next.js** (auto-detect)

3. **Configure Project**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables** (PENTING!):
   
   Tambahkan variable berikut (akan diupdate setelah ngrok running):
   
   ```
   # Database (Vercel Postgres)
   DATABASE_URL=postgresql://... (akan dibuat otomatis)
   
   # Backend URLs (isi sementara dulu, update nanti)
   NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
   NEXT_PUBLIC_FLASK_URL=http://localhost:5000
   NGROK_URL=http://localhost:3000
   
   # WhatsApp & Telegram
   FONNTE_TOKEN=UEKGM5BfP2L1DMb8zaR5
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_BOT_USERNAME=your_bot_username
   
   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Application Settings
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

5. **Deploy**: Click "Deploy"

### 2.3 Setup Vercel Postgres (Database)

1. Di Vercel Dashboard → Project → Storage
2. Click "Create Database" → Choose "Postgres"
3. Copy connection string ke environment variable `DATABASE_URL`
4. Redeploy project

### 2.4 Setup Database Tables

```bash
# Jalankan migration script ke Vercel Postgres
# Update DATABASE_URL di .env.local dengan Vercel Postgres URL
node scripts/migrate-to-postgres.js
```

---

## 💻 BAGIAN 3: Menjalankan Backend di Laptop

### 3.1 Start ngrok Tunnels

```bash
# Terminal 1: Start ngrok
ngrok start --all --config ngrok.yml
```

**Catat URL yang diberikan ngrok:**
- Flask tunnel: `https://xxxx-xx-xx-xx-xx.ngrok-free.app` 
- Socket tunnel: `https://yyyy-yy-yy-yy-yy.ngrok-free.app`

### 3.2 Update Environment Variables di Vercel

1. Buka Vercel Dashboard → Project → Settings → Environment Variables
2. Update variable berikut dengan URL ngrok:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://yyyy-yy-yy-yy-yy.ngrok-free.app
   NEXT_PUBLIC_FLASK_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
   NGROK_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
   ```
3. **Redeploy** project di Vercel agar variable baru aktif

### 3.3 Update .env.local di Laptop

```env
# Database Configuration (Vercel Postgres)
DATABASE_URL=postgresql://vercel-postgres-url-from-vercel

# Backend API Configuration
BACKEND_API_URL=https://your-app.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://yyyy-yy-yy-yy-yy.ngrok-free.app

# Flask AI Backend (YOLOv8)
FLASK_AI_URL=http://localhost:5000
NEXT_PUBLIC_FLASK_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app

# WhatsApp Configuration (Fonnte)
FONNTE_TOKEN=UEKGM5BfP2L1DMb8zaR5

# Public URL for WhatsApp images (ngrok)
NGROK_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3.4 Start Backend Services

```bash
# Terminal 2: Start Socket.IO & Telegram Bot
npm run backend

# Terminal 3: Start Flask AI Backend
python app.py
```

---

## ✅ BAGIAN 4: Verifikasi Deployment

### 4.1 Checklist

- [ ] Frontend Vercel bisa diakses
- [ ] ngrok tunnels running
- [ ] Socket.IO server running (port 4001)
- [ ] Flask server running (port 5000)
- [ ] Telegram bot running
- [ ] Database connected
- [ ] CCTV bisa ditambahkan
- [ ] Real-time alerts bekerja
- [ ] Telegram notifications bekerja

### 4.2 Test Koneksi

1. **Frontend**: Buka `https://your-app.vercel.app`
2. **Socket.IO**: Check browser console untuk koneksi WebSocket
3. **Flask**: Check status di dashboard
4. **Telegram**: Kirim test notification

---

## 🔄 BAGIAN 5: Workflow Harian

### Setiap kali menjalankan:

1. **Start ngrok** (Terminal 1):
   ```bash
   ngrok start --all --config ngrok.yml
   ```

2. **Catat URL baru dari ngrok** (ngrok free = URL berubah setiap restart)

3. **Update Vercel Environment Variables** dengan URL ngrok baru

4. **Redeploy Vercel** (Quick redeploy):
   - Buka Vercel Dashboard
   - Deployments → Click "..." → "Redeploy"
   
5. **Start Backend Services** (Terminal 2 & 3):
   ```bash
   # Terminal 2
   npm run backend
   
   # Terminal 3
   python app.py
   ```

---

## 💡 TIPS & SOLUSI

### Ngrok URL Berubah Terus?

**Solusi 1: Ngrok Paid Plan** ($8/bulan)
- Dapat static domain
- Tidak perlu update URL setiap restart

**Solusi 2: Automation Script**
Saya akan buatkan script otomatis update Vercel env vars.

### Laptop Sleep/Restart?

Backend akan mati. Solusi:
1. Disable sleep mode saat production
2. Atau upgrade ke VPS murah (Contabo, DigitalOcean)

### Internet Bermasalah?

- Pastikan port forwarding di router
- Atau gunakan VPS untuk backend

---

## 🆘 Troubleshooting

### Error: Cannot connect to Socket.IO

```bash
# Check ngrok tunnel
curl https://yyyy-yy-yy-yy-yy.ngrok-free.app

# Check Socket.IO running
netstat -ano | findstr :4001
```

### Error: Flask tidak terdeteksi

```bash
# Check Flask running
curl http://localhost:5000

# Check ngrok tunnel
curl https://xxxx-xx-xx-xx-xx.ngrok-free.app
```

### Error: Database connection failed

- Pastikan DATABASE_URL correct
- Check Vercel Postgres status
- Verify connection string

---

## 📞 Support

Jika ada error, check:
1. Browser Console (F12)
2. Terminal logs
3. Vercel deployment logs
4. ngrok inspector: http://localhost:4040

---

## 🎉 Selamat!

Aplikasi Anda sekarang:
- ✅ Frontend hosted di Vercel (global CDN, fast)
- ✅ Backend AI running di laptop (GPU power)
- ✅ Real-time notifications via WebSocket
- ✅ Scalable dan professional

**Next Steps:**
- Monitor performance di Vercel Analytics
- Setup alerting untuk backend downtime
- Consider VPS untuk backend 24/7
